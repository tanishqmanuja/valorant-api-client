import { type AxiosResponse, AxiosError } from "axios";
import {
  getAccessTokenHeader,
  getJsonHeader,
  parseEntitlementsToken,
  parseTokensFromResponse,
  parseTokensFromUri,
} from "~/helpers";
import type {
  ValorantAuthResponse,
  AuthTokenResponse,
  AuthMFAResponse,
  MfaCodeProvider,
} from "./types";
import { AuthApiClient } from "~/clients";
import { MFAError } from "./errors";

export function isTokenResponse(
  response: AxiosResponse<ValorantAuthResponse>,
): response is AxiosResponse<AuthTokenResponse> {
  return response.data.type === "response";
}

export function isMfaResponse(
  response: AxiosResponse<ValorantAuthResponse>,
): response is AxiosResponse<AuthMFAResponse> {
  return response.data.type === "multifactor";
}

export async function getEntitlementsToken(
  api: AuthApiClient,
  accessToken: string,
) {
  const entitlementResponse = await api.postEntitlement({
    headers: {
      ...getAccessTokenHeader(accessToken),
      ...getJsonHeader(),
    },
  });

  return parseEntitlementsToken(entitlementResponse);
}

export async function getTokensUsingReauthCookies(api: AuthApiClient) {
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
  api: AuthApiClient,
  mfaCodeProvider: MfaCodeProvider,
  authResponse?: AxiosResponse<AuthMFAResponse>,
) {
  const { code: mfaCode } = await mfaCodeProvider(authResponse);

  const mfaTokenResponse =
    await api.putMultiFactorAuthentication<ValorantAuthResponse>({
      data: {
        type: "multifactor",
        code: mfaCode,
        rememberDevice: true,
      } as any, // TODO: fix type
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
  api: AuthApiClient,
  username: string,
  password: string,
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
    } as any, // TODO: fix type
  });

  if (isMfaResponse(authResponse)) {
    throw new MFAError(
      "Got MFA response while trying credentials authentication",
      authResponse,
    );
  }

  if (!isTokenResponse(authResponse)) {
    throw Error(
      "Got unexpected response while trying credentials authentication",
    );
  }

  return parseTokensFromResponse(authResponse);
}

export async function getTokensUsingCombinedStrategy(
  api: AuthApiClient,
  username: string,
  password: string,
  mfaCodeProvider: MfaCodeProvider,
) {
  return await getTokensUsingCredentials(api, username, password).catch(
    async err => {
      if (err instanceof MFAError) {
        return await getTokensUsingMfaCode(api, mfaCodeProvider, err.response);
      } else {
        throw err;
      }
    },
  );
}
