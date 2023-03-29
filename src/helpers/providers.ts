import axios, { type AxiosResponse } from "axios";
import { Agent } from "node:https";
import { objectEntries } from "ts-extras";
import { WritableDeep } from "type-fest";

import {
  parseAccessToken,
  parseAuthCookie,
  parseEntitlementsToken,
  parseIdToken,
} from "~/api-clients/auth.js";
import { RemoteProviderContext } from "~/api-clients/valorant.js";
import { getLockFileDataPromise } from "~/file-parser/lockfile.js";
import { getLogFileDataPromise } from "~/file-parser/logfile";
import {
  getAccessTokenHeader,
  getJsonHeader,
  getCookieHeader,
  getEntitlementsJWTHeader,
  getClientPlatformHeader,
  getClientVersionHeader,
} from "~/helpers/headers.js";
import { Region, RegionShard, regionShardMap } from "~/helpers/regions.js";
import { getRegionAndShardFromGlzServer } from "~/helpers/servers.js";
import { MaybePromise } from "~/utils/lib/typescript/promise";

import { DEFAULT_PLATFORM_INFO, fetchPas, getPuuidFromAccessToken } from "..";

export type AuthParameters = {
  uri: string;
};

export type AuthResponse = {
  mode: string;
  parameters: AuthParameters;
};

export type AuthMultifactor = {
  email: string;
  method: string;
  methods: string[];
  multiFactorCodeLength: number;
  mfaVersion: string;
};

export type AuthTokenResponse = {
  type: "response";
  response: AuthResponse;
  country: string;
};

export interface AuthMFAResponse {
  type: "multifactor";
  multifactor: AuthMultifactor;
  country: string;
  securityProfile: string;
}

export type ValorantAuthResponse = AuthTokenResponse | AuthMFAResponse;

function isTokenResponse(
  response: AxiosResponse<ValorantAuthResponse>
): response is AxiosResponse<AuthTokenResponse> {
  return response.data.type === "response";
}

function isMfaResponse(
  response: AxiosResponse<ValorantAuthResponse>
): response is AxiosResponse<AuthMFAResponse> {
  return response.data.type === "multifactor";
}

export type MfaCodeProvider = (
  response: AxiosResponse<AuthMFAResponse>
) => MaybePromise<{ code: string }>;

export function provideAuth(
  username: string,
  password: string,
  mfaCodeProvider?: MfaCodeProvider
) {
  return async ({ authApiClient }: RemoteProviderContext) => {
    const { api, setCookie } = authApiClient;

    const cookieResponse = await api.postAuthCookies({
      data: {
        client_id: "play-valorant-web-prod",
        nonce: "1",
        redirect_uri: "https://playvalorant.com/opt_in",
        response_type: "token id_token",
        scope: "account openid",
      },
    });

    let cookie = parseAuthCookie(cookieResponse);

    // Warning: Side Effect
    setCookie(cookie);

    let tokenResponse;
    const queryResponse = await api.putAuthRequest<ValorantAuthResponse>({
      data: {
        language: "en_US",
        remember: true,
        type: "auth",
        username,
        password,
      },
      headers: { ...getCookieHeader(cookie) },
    });

    if (isTokenResponse(queryResponse)) {
      tokenResponse = queryResponse;
    }

    if (isMfaResponse(queryResponse)) {
      if (!mfaCodeProvider) {
        throw Error("MFA code provider is not provided");
      }

      cookie = parseAuthCookie(queryResponse);

      // Warning: Side Effect
      setCookie(cookie);

      const { code: mfaCode } = await mfaCodeProvider(queryResponse);

      const mfaTokenResponse =
        await api.putMultiFactorAuthentication<ValorantAuthResponse>({
          data: {
            type: "multifactor",
            code: mfaCode,
            rememberDevice: true,
          },
          headers: {
            ...getCookieHeader(cookie),
            ...getJsonHeader(),
          },
        });

      if (isTokenResponse(mfaTokenResponse)) {
        tokenResponse = mfaTokenResponse;
      }
    }

    if (!tokenResponse) {
      throw Error("Invalid auth token response");
    }

    const accessToken = parseAccessToken(tokenResponse);
    const idToken = parseIdToken(tokenResponse);

    const entitlementResponse = await api.postEntitlement({
      headers: {
        ...getCookieHeader(cookie),
        ...getAccessTokenHeader(accessToken),
        ...getJsonHeader(),
      },
    });

    const entitlementsToken = parseEntitlementsToken(entitlementResponse);

    return {
      idToken,
      accessToken,
      entitlementsToken,
    } as const;
  };
}

export function _provideAuthRegionClientVersion(
  username: string,
  password: string,
  mfaCodeProvider?: MfaCodeProvider
) {
  return async (ctx: RemoteProviderContext) => {
    const auth = await provideAuth(username, password, mfaCodeProvider)(ctx);
    const { clientVersion } = await provideClientVersionViaVAPI()();

    const {
      affinities: { live: regionOrShard },
    } = await fetchPas(auth.accessToken, auth.idToken);

    const editableRegionShardMap = structuredClone(
      regionShardMap
    ) as WritableDeep<typeof regionShardMap> as Record<string, string[]>;

    const possibleRegionShardMapEntries: [string, string[]][] = objectEntries(
      editableRegionShardMap
    )
      .filter(
        ([region, shards]) =>
          region === regionOrShard ||
          (shards as string[]).includes(regionOrShard)
      )
      .map(([region, shards]) => {
        if (region === regionOrShard) {
          return [region, shards];
        } else {
          return [region, [shards.find(shard => shard === regionOrShard)!]];
        }
      });

    const possibleRegionShardEntries = possibleRegionShardMapEntries.reduce(
      (acc, [region, shards]) => {
        acc.push(...shards.map(shard => ({ region, shard })));
        return acc;
      },
      [] as Array<{ region: string; shard: string }>
    );

    const puuid = getPuuidFromAccessToken(auth.accessToken);

    const response = await Promise.any(
      possibleRegionShardEntries.map(({ region, shard }) =>
        axios.get(
          `https://glz-${region}-1.${shard}.a.pvp.net/parties/v1/players/${puuid}`,
          {
            httpsAgent: new Agent({
              rejectUnauthorized: false,
            }),
            headers: {
              ...getAccessTokenHeader(auth.accessToken),
              ...getEntitlementsJWTHeader(auth.entitlementsToken),
              ...getClientPlatformHeader(DEFAULT_PLATFORM_INFO),
              ...getClientVersionHeader(clientVersion),
            },
          }
        )
      )
    );

    const { region, shard } = getRegionAndShardFromGlzServer(
      response.config.url!
    );

    return {
      ...auth,
      region,
      shard,
      clientVersion,
    } as const;
  };
}

export function provideAuthViaLocalApi() {
  return async ({ localApiClient }: RemoteProviderContext) => {
    if (!localApiClient) {
      throw Error("Provider unable to access localApiClient");
    }

    const { api } = localApiClient;

    const {
      data: { accessToken, token: entitlementsToken },
    } = await api.getEntitlementsToken();

    return {
      accessToken,
      entitlementsToken,
    } as const;
  };
}

export function provideRegion<R extends Region>(
  region: R,
  shard: RegionShard<R>
) {
  return () => ({ region, shard } as const);
}

export function provideClientVersionViaVAPI() {
  return async () => {
    const { data } = await axios.get<{ data: { riotClientVersion: string } }>(
      "https://valorant-api.com/v1/version"
    );
    const {
      data: { riotClientVersion },
    } = data;
    return { clientVersion: riotClientVersion } as const;
  };
}

export function provideLockFile(lockfilePath?: string) {
  return async () => {
    const lockfile = await getLockFileDataPromise(lockfilePath);
    if (!lockfile) {
      throw Error("Unable to get lockfile data");
    }
    return { ...lockfile } as const;
  };
}

export function provideLogFile(logfilePath?: string) {
  return async () => {
    const logfile = await getLogFileDataPromise(logfilePath);
    if (!logfile) {
      throw Error("Unable to get logfile data");
    }
    return {
      ...logfile,
      ...getRegionAndShardFromGlzServer(logfile.servers.glz),
    } as const;
  };
}
