import axios from "axios";

import {
  createAuthApiClient,
  createRemoteApiClient,
  getAccessTokenHeader,
  getCookieHeader,
  getJsonHeader,
  getPuuidFromAccessToken,
  getRegionOptions,
  parseAccessToken,
  parseAuthCookie,
  parseEntitlementsToken,
} from "~/index.js";

const RIOT_USERNAME = process.env.RIOT_USERNAME;
const RIOT_PASSWORD = process.env.RIOT_PASSWORD;

// change as per your requirement
const REGION = "ap";
const SHARD = "ap";

if (!(RIOT_USERNAME && RIOT_PASSWORD)) {
  console.log("Error: Provide username and password");
  console.log("Either edit the script or use ENV variables.");
  console.log(
    `For setting ENV variables in Powershell use,\n($env:RIOT_USERNAME="123") -and ($env:RIOT_PASSWORD="XYZ")`
  );
  process.exit(1);
}

(async () => {
  const { api: authApi } = createAuthApiClient();

  const cookieResponse = await authApi.postAuthCookies({
    data: {
      client_id: "play-valorant-web-prod",
      nonce: "1",
      redirect_uri: "https://playvalorant.com/opt_in",
      response_type: "token id_token",
      scope: "account openid",
    },
  });

  const cookie = parseAuthCookie(cookieResponse);

  const tokenResponse = await authApi.putAuthRequest({
    data: {
      language: "en_US",
      remember: true,
      type: "auth",
      username: RIOT_USERNAME,
      password: RIOT_PASSWORD,
    },
    headers: { ...getCookieHeader(cookie) },
  });

  const accessToken = parseAccessToken(tokenResponse);
  const selfPuuid = getPuuidFromAccessToken(accessToken);

  const entitlementResponse = await authApi.postEntitlement({
    headers: {
      ...getCookieHeader(cookie),
      ...getAccessTokenHeader(accessToken),
      ...getJsonHeader(),
    },
  });

  const entitlementsToken = parseEntitlementsToken(entitlementResponse);

  const { api: remoteAPI } = createRemoteApiClient({
    clientVersion: await getClientVersion(),
    ...getRegionOptions(REGION, SHARD),
    accessToken,
    entitlementsToken,
  });

  console.log("PUUID", selfPuuid);

  const { data: competitiveUpdates } = await remoteAPI
    .getCompetitiveUpdates({
      data: {
        puuid: selfPuuid,
      },
    })
    .catch();

  console.log(competitiveUpdates);
})();

async function getClientVersion(): Promise<string> {
  const { data } = await axios.get("https://valorant-api.com/v1/version");
  const {
    data: { riotClientVersion },
  } = data;
  return riotClientVersion;
}
