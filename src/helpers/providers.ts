import axios from "axios";
import {
  parseAccessToken,
  parseAuthCookie,
  parseEntitlementsToken,
} from "~/api-client/auth.js";
import {
  getAccessTokenHeader,
  getJsonHeader,
  getCookieHeader,
} from "~/helpers/headers.js";
import { RegionOpts, getRegionOptions } from "~/helpers/regions.js";
import { getRegionAndShardFromGlzServer } from "~/helpers/servers.js";
import { RemoteContext } from "~/api-client/valorant.js";
import { RemoteApiClientOptions } from "~/api-client/remote";
import { getLockFileDataPromise, getLogFileDataPromise } from "..";

export function provideRemoteAuth(username: string, password: string) {
  return async ({ authApiClient }: RemoteContext) => {
    const { api, helpers } = authApiClient;

    const cookieResponse = await api.postAuthCookies({
      data: {
        client_id: "play-valorant-web-prod",
        nonce: "1",
        redirect_uri: "https://playvalorant.com/opt_in",
        response_type: "token id_token",
        scope: "account openid",
      },
    });

    const cookie = parseAuthCookie(cookieResponse);

    // Warning: Side Effect
    helpers.setCookie(cookie);

    const tokenResponse = await api.putAuthRequest({
      data: {
        language: "en_US",
        remember: true,
        type: "auth",
        username,
        password,
      },
      headers: { ...getCookieHeader(cookie) },
    });

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
    } satisfies Partial<RemoteApiClientOptions>;
  };
}

export function provideRemoteAuthViaLocalApi() {
  return async ({ localApiClient }: RemoteContext) => {
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
    } satisfies Partial<RemoteApiClientOptions>;
  };
}

export function provideRegion<
  R extends RegionOpts["region"],
  S extends Extract<RegionOpts, { region: R }>["shard"]
>(region: R, shard: S) {
  return () => getRegionOptions(region, shard as any);
}

export function provideClientVersionViaVAPI() {
  return async () => {
    const { data } = await axios.get<{ data: { riotClientVersion: string } }>(
      "https://valorant-api.com/v1/version"
    );
    const {
      data: { riotClientVersion },
    } = data;
    return { clientVersion: riotClientVersion };
  };
}

export function provideLockFile() {
  return async () => {
    const lockfile = await getLockFileDataPromise();
    if (!lockfile) {
      throw Error("Unable to get lockfile data");
    }
    return lockfile;
  };
}

export function provideLogFile() {
  return async () => {
    const logfile = await getLogFileDataPromise();
    if (!logfile) {
      throw Error("Unable to get logfile data");
    }
    return {
      ...logfile,
      ...getRegionAndShardFromGlzServer(logfile.servers.glz),
    };
  };
}
