import { authRequestEndpoint } from "valorant-api-types";
import type { VapicProvider } from "~/clients";
import { getRegionAndShardFromPas } from "~/helpers";
import {
  getEntitlementsToken,
  getTokensUsingCombinedStrategy,
  getTokensUsingCredentials,
  getTokensUsingMfaCode,
  getTokensUsingReauthCookies,
} from "./helpers";
import type { MfaCodeProvider } from "./types";

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
    } as const;
  }) satisfies VapicProvider;
}

/**
 * @client remote
 * @provides access-token, entitlements-token, id-token
 */
export function provideAuth(
  username: string,
  password: string,
  mfaCodeProvider?: MfaCodeProvider,
) {
  return (async ({ auth }) => {
    const { cookieJar } = auth;

    const previousCookies = cookieJar.getCookiesSync(
      authRequestEndpoint.suffix,
      { allPaths: true },
    );

    const { accessToken, idToken } = await new Promise((resolve, reject) => {
      if (previousCookies.some(cookie => cookie.key === "ssid")) {
        resolve(true);
      } else {
        reject(false);
      }
    })
      .then(() => getTokensUsingReauthCookies(auth))
      .catch(() =>
        mfaCodeProvider
          ? getTokensUsingCombinedStrategy(
              auth,
              username,
              password,
              mfaCodeProvider,
            )
          : getTokensUsingCredentials(auth, username, password),
      );

    const entitlementsToken = await getEntitlementsToken(auth, accessToken);

    return {
      idToken,
      accessToken,
      entitlementsToken,
    } as const;
  }) satisfies VapicProvider;
}

/**
 * @client remote
 * @provides access-token, entitlements-token, id-token
 */
export function provideAuthMfaCode(mfaCodeProvider: MfaCodeProvider) {
  return (async ({ auth }) => {
    const { accessToken, idToken } = await getTokensUsingMfaCode(
      auth,
      mfaCodeProvider,
    );

    const entitlementsToken = await getEntitlementsToken(auth, accessToken);

    return {
      idToken,
      accessToken,
      entitlementsToken,
    } as const;
  }) satisfies VapicProvider;
}

/**
 * @client remote
 * @provides region, shard, access-token, entitlements-token, id-token
 */
export function provideAuthAutoRegion(
  username: string,
  password: string,
  mfaCodeProvider?: MfaCodeProvider,
) {
  return (async ctx => {
    const auth = await provideAuth(username, password, mfaCodeProvider)(ctx);
    const { region, shard } = await getRegionAndShardFromPas(
      auth.accessToken,
      auth.idToken,
    );

    return {
      ...auth,
      region,
      shard,
    } as const;
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
  return (() =>
    ({ accessToken, entitlementsToken }) as const) satisfies VapicProvider;
}
