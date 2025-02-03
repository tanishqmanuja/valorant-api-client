import type { VapicProvider } from "~/clients/valorant/types";

/**
 * @client remote
 * @provides access-token, entitlements-token
 */
export function provideAuthViaLocalApi() {
  return (async ({ local }) => {
    const {
      data: { accessToken, token: entitlementsToken },
    } = await local.getEntitlementsToken();

    return {
      accessToken,
      entitlementsToken,
    };
  }) satisfies VapicProvider;
}

/**
 * @client remote
 * @provides access-token, entitlements-token
 */
export function provideAuthViaTokens(
  accessToken: string,
  entitlementsToken: string,
) {
  return (() => ({ accessToken, entitlementsToken })) satisfies VapicProvider;
}
