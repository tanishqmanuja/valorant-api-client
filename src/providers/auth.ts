import type { AxiosError, AxiosResponse } from "axios";
import { array as A, boolean as B, option as O } from "fp-ts";
import { pipe } from "fp-ts/lib/function.js";
import { objectEntries } from "ts-extras";
import { authRequestEndpoint } from "valorant-api-types";

import type { AuthApi } from "~/api-clients/types.js";
import { RemoteProviderContext } from "~/api-clients/valorant.js";
import { getAccessTokenHeader, getJsonHeader } from "~/helpers/headers.js";
import { fetchPas } from "~/helpers/helpers.js";
import { regionShardMap } from "~/helpers/regions.js";
import {
  parseEntitlementsToken,
  parseTokensFromUri,
  parseTokensFromResponse,
} from "~/helpers/tokens.js";
import { MaybePromise } from "~/utils/lib/typescript/promise.js";

import { provideClientVersionViaVAPI } from "./others.js";

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
    const { api, getCookieJar } = authApiClient;

    const cookieJar = getCookieJar();
    const previousCookies = cookieJar.getCookiesSync(
      authRequestEndpoint.suffix,
      { allPaths: true }
    );

    const { accessToken, idToken } = await pipe(
      previousCookies,
      A.some(cookie => cookie.key === "ssid"),
      B.match(
        () => O.none,
        O.tryCatchK(() => getTokensUsingReauthStrategy(api))
      ),
      O.getOrElse(() =>
        getTokensUsingDefaultStrategy(api, username, password, mfaCodeProvider)
      )
    );

    const entitlementResponse = await api.postEntitlement({
      headers: {
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

export function provideRemoteAuto(
  username: string,
  password: string,
  mfaCodeProvider?: MfaCodeProvider
) {
  return async (ctx: RemoteProviderContext) => {
    const auth = await provideAuth(username, password, mfaCodeProvider)(ctx);
    const { clientVersion } = await provideClientVersionViaVAPI()();

    const {
      affinities: { live: possibleRegion },
      token: pasToken,
    } = await fetchPas(auth.accessToken, auth.idToken);

    const possibleRegionShardMapEntry = objectEntries(regionShardMap).find(
      ([region]) => region === possibleRegion
    );

    if (!possibleRegionShardMapEntry) {
      throw Error(`Unable to find region shard for ${possibleRegion}`);
    }

    const region = possibleRegionShardMapEntry[0];
    const shard = possibleRegionShardMapEntry[1].at(0)!;

    return {
      ...auth,
      pasToken,
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

export async function getTokensUsingReauthStrategy(api: AuthApi) {
  const reauthResponseUri = await api
    .getCookieReauth({
      maxRedirects: 0,
      validateStatus: status => status === 303,
    })
    .then(res => res.headers["location"])
    .catch((err: AxiosError) => err.response?.headers["location"]);

  return parseTokensFromUri(reauthResponseUri);
}

export async function getTokensUsingDefaultStrategy(
  api: AuthApi,
  username: string,
  password: string,
  mfaCodeProvider?: MfaCodeProvider
) {
  await api.postAuthCookies({
    data: {
      client_id: "play-valorant-web-prod",
      nonce: "1",
      redirect_uri: "https://playvalorant.com/opt_in",
      response_type: "token id_token",
      scope: "account openid",
    },
  });

  let tokenResponse;
  const authResponse = await api.putAuthRequest<ValorantAuthResponse>({
    data: {
      language: "en_US",
      remember: true,
      type: "auth",
      username,
      password,
    },
  });

  if (isTokenResponse(authResponse)) {
    tokenResponse = authResponse;
  }

  if (isMfaResponse(authResponse)) {
    if (!mfaCodeProvider) {
      throw Error("MFA code provider is not provided");
    }

    const { code: mfaCode } = await mfaCodeProvider(authResponse);

    const mfaTokenResponse =
      await api.putMultiFactorAuthentication<ValorantAuthResponse>({
        data: {
          type: "multifactor",
          code: mfaCode,
          rememberDevice: true,
        },
        headers: {
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

  return parseTokensFromResponse(tokenResponse);
}
