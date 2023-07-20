import type { VapicProvider } from "~/clients";
import { array as A, boolean as B, option as O } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import type { MfaCodeProvider } from "./types";
import { getRegionAndShardFromPas } from "~/helpers";
import {
  getEntitlementsToken,
  getTokensUsingCombinedStrategy,
  getTokensUsingCredentials,
  getTokensUsingMfaCode,
  getTokensUsingReauthCookies,
} from "./helpers";
import { authRequestEndpoint } from "@tqman/valorant-api-types";

/**
 * @client remote
 * @provides access-token, entitlements-token
 */
export function provideAuthViaLocalApi() {
  return (async ({ local }) => {
    if (!local) {
      throw Error("Provider unable to access localApiClient");
    }

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

    const { accessToken, idToken } = await pipe(
      previousCookies,
      A.some(cookie => cookie.key === "ssid"),
      B.match(
        () => O.none,
        O.tryCatchK(() => getTokensUsingReauthCookies(auth)),
      ),
      O.getOrElse(() =>
        mfaCodeProvider
          ? getTokensUsingCombinedStrategy(
              auth,
              username,
              password,
              mfaCodeProvider,
            )
          : getTokensUsingCredentials(auth, username, password),
      ),
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
