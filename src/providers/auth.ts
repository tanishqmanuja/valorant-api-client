import type { AxiosResponse } from "axios";
import { objectEntries } from "ts-extras";

import {
  parseAccessToken,
  parseAuthCookie,
  parseEntitlementsToken,
  parseIdToken,
} from "~/api-clients/auth.js";
import { RemoteProviderContext } from "~/api-clients/valorant.js";
import {
  getAccessTokenHeader,
  getJsonHeader,
  getCookieHeader,
} from "~/helpers/headers.js";
import { fetchPas } from "~/helpers/helpers.js";
import { regionShardMap } from "~/helpers/regions.js";
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
    const authResponse = await api.putAuthRequest<ValorantAuthResponse>({
      data: {
        language: "en_US",
        remember: true,
        type: "auth",
        username,
        password,
      },
      headers: { ...getCookieHeader(cookie) },
    });

    if (isTokenResponse(authResponse)) {
      tokenResponse = authResponse;
    }

    if (isMfaResponse(authResponse)) {
      if (!mfaCodeProvider) {
        throw Error("MFA code provider is not provided");
      }

      cookie = parseAuthCookie(authResponse);

      // Warning: Side Effect
      setCookie(cookie);

      const { code: mfaCode } = await mfaCodeProvider(authResponse);

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
