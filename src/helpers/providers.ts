import axios, { type AxiosResponse } from "axios";

import {
  parseAccessToken,
  parseAuthCookie,
  parseEntitlementsToken,
} from "~/api-clients/auth.js";
import { RemoteProviderContext } from "~/api-clients/valorant.js";
import { getLockFileDataPromise } from "~/file-parser/lockfile.js";
import { getLogFileDataPromise } from "~/file-parser/logfile";
import {
  getAccessTokenHeader,
  getJsonHeader,
  getCookieHeader,
} from "~/helpers/headers.js";
import { RegionOpts } from "~/helpers/regions.js";
import { getRegionAndShardFromGlzServer } from "~/helpers/servers.js";
import { MaybePromise } from "~/utils/lib/typescript/promise";

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

    const entitlementResponse = await api.postEntitlement({
      headers: {
        ...getCookieHeader(cookie),
        ...getAccessTokenHeader(accessToken),
        ...getJsonHeader(),
      },
    });

    const entitlementsToken = parseEntitlementsToken(entitlementResponse);
    return {
      accessToken,
      entitlementsToken,
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

export function provideRegion<R extends RegionOpts["region"]>(
  region: R,
  shard: Extract<RegionOpts, { region: R }>["shard"]
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
