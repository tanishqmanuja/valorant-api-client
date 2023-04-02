import type { AxiosError, AxiosResponse } from "axios";
import { array as A, boolean as B, option as O } from "fp-ts";
import { pipe } from "fp-ts/lib/function.js";
import { authRequestEndpoint } from "valorant-api-types";

import type { AuthApi } from "~/api-clients/types.js";
import { RemoteProviderContext } from "~/api-clients/valorant.js";
import { getAccessTokenHeader, getJsonHeader } from "~/helpers/headers.js";
import { getRegionAndShardFromPas } from "~/helpers/regions.js";
import {
  parseEntitlementsToken,
  parseTokensFromUri,
  parseTokensFromResponse,
} from "~/helpers/tokens.js";
import { MaybePromise } from "~/utils/lib/typescript/promise.js";

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

export function isTokenResponse(
  response: AxiosResponse<ValorantAuthResponse>
): response is AxiosResponse<AuthTokenResponse> {
  return response.data.type === "response";
}

export function isMfaResponse(
  response: AxiosResponse<ValorantAuthResponse>
): response is AxiosResponse<AuthMFAResponse> {
  return response.data.type === "multifactor";
}

export type MfaCodeProvider = (
  response?: AxiosResponse<AuthMFAResponse>
) => MaybePromise<{ code: string }>;

export class MFAError extends Error {
  constructor(
    public message: string,
    public response: AxiosResponse<AuthMFAResponse>
  ) {
    super(message);
  }
}

// Providers

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
        O.tryCatchK(() => getTokensUsingReauthCookies(api))
      ),
      O.getOrElse(() =>
        mfaCodeProvider
          ? getTokensUsingCombinedStrategy(
              api,
              username,
              password,
              mfaCodeProvider
            )
          : getTokensUsingCredentials(api, username, password)
      )
    );

    const entitlementsToken = await getEntitlementsToken(api, accessToken);

    return {
      idToken,
      accessToken,
      entitlementsToken,
    } as const;
  };
}

export function provideAuthMfaCode(mfaCodeProvider: MfaCodeProvider) {
  return async ({ authApiClient }: RemoteProviderContext) => {
    const { api } = authApiClient;

    const { accessToken, idToken } = await getTokensUsingMfaCode(
      api,
      mfaCodeProvider
    );

    const entitlementsToken = await getEntitlementsToken(api, accessToken);

    return {
      idToken,
      accessToken,
      entitlementsToken,
    } as const;
  };
}

export function provideAuthAutoRegion(
  username: string,
  password: string,
  mfaCodeProvider?: MfaCodeProvider
) {
  return async (ctx: RemoteProviderContext) => {
    const auth = await provideAuth(username, password, mfaCodeProvider)(ctx);
    const { region, shard } = await getRegionAndShardFromPas(
      auth.accessToken,
      auth.idToken
    );

    return {
      ...auth,
      region,
      shard,
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

// Helpers

export async function getEntitlementsToken(api: AuthApi, accessToken: string) {
  const entitlementResponse = await api.postEntitlement({
    headers: {
      ...getAccessTokenHeader(accessToken),
      ...getJsonHeader(),
    },
  });

  return parseEntitlementsToken(entitlementResponse);
}

export async function getTokensUsingReauthCookies(api: AuthApi) {
  const reauthResponseUri = await api
    .getCookieReauth({
      maxRedirects: 0,
      validateStatus: status => status === 303,
    })
    .then(res => res.headers["location"])
    .catch((err: AxiosError) => err.response?.headers["location"]);

  return parseTokensFromUri(reauthResponseUri);
}

export async function getTokensUsingMfaCode(
  api: AuthApi,
  mfaCodeProvider: MfaCodeProvider,
  authResponse?: AxiosResponse<AuthMFAResponse>
) {
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

  if (!isTokenResponse(mfaTokenResponse)) {
    throw Error("Got unexpected response while trying mfa authentication");
  }

  return parseTokensFromResponse(mfaTokenResponse);
}

export async function getTokensUsingCredentials(
  api: AuthApi,
  username: string,
  password: string
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

  const authResponse = await api.putAuthRequest<ValorantAuthResponse>({
    data: {
      language: "en_US",
      remember: true,
      type: "auth",
      username,
      password,
    },
  });

  if (isMfaResponse(authResponse)) {
    throw new MFAError(
      "Got MFA response while trying credentials authentication",
      authResponse
    );
  }

  if (!isTokenResponse(authResponse)) {
    throw Error(
      "Got unexpected response while trying credentials authentication"
    );
  }

  return parseTokensFromResponse(authResponse);
}

export async function getTokensUsingCombinedStrategy(
  api: AuthApi,
  username: string,
  password: string,
  mfaCodeProvider: MfaCodeProvider
) {
  return await getTokensUsingCredentials(api, username, password).catch(
    async err => {
      if (err instanceof MFAError) {
        return await getTokensUsingMfaCode(api, mfaCodeProvider, err.response);
      } else {
        throw err;
      }
    }
  );
}
