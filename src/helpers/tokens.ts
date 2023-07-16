import type { AxiosResponse } from "axios";

export function parseTokensFromUri(uri: string) {
  let url = new URL(uri);
  let params = new URLSearchParams(url.hash.substring(1));
  const accessToken = params.get("access_token");
  const idToken = params.get("id_token");

  if (!accessToken) {
    throw Error("No Access token found in response");
  }

  if (!idToken) {
    throw Error("No Id token found in response");
  }

  return { accessToken, idToken };
}

export function parseTokensFromResponse<T extends { data: any }>(response: T) {
  return parseTokensFromUri(response.data.response.parameters.uri);
}

export function parseEntitlementsToken(
  response: AxiosResponse<{ entitlements_token: string }>,
) {
  return response.data.entitlements_token;
}
