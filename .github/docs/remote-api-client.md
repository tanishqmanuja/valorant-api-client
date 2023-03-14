# Remote API Client

Api wrapper for calling remote endpoints.

> Remote endpoints includes shared,glz,pd endpoints

## Options

- `accessToken`<code style="background-color: #FD8A8A">required</code>: string
- `entitlementsToken`<code style="background-color: #FD8A8A">required</code>: string
- `shard`<code style="background-color: #FD8A8A">required</code>: string
- `region`<code style="background-color: #FD8A8A">required</code>: string
- `platformInfo`<code style="background-color: #7286D3">optional</code>: PlatformSchema
- `userAgent`<code style="background-color: #7286D3">optional</code>: string
- `zodParseResponse`<code style="background-color: #7286D3">optional</code>: boolean

## Usage

Using Local API

```typescript
const lockfile = await getLockFileDataPromise();
const logfile = await getLogFileDataPromise();

if (lockfile && logfile) {
  const { password, port } = lockfile;
  const { api: localAPI } = createLocalApiClient({
    password,
    port,
  });

  const { clientVersion, servers } = logfile;
  const { shard, region } = getRegionAndShardFromGlzServer(servers.glz);

  const {
    data: { accessToken, token: entitlementsToken, subject: selfPuuid },
  } = await localAPI.getEntitlementsToken();

  console.log("PUUID", selfPuuid);

  const { api: remoteAPI } = createRemoteApiClient({
    shard,
    region,
    accessToken,
    entitlementsToken,
    clientVersion,
  });

  const { data: mmr } = await remoteAPI.getPlayerMMR({
    data: { puuid: selfPuuid },
  });

  console.log(mmr);
}
```

Using Auth Api

```typescript
// change as per your requirement
const RIOT_USERNAME = "RIOT_USERNAME";
const RIOT_PASSWORD = "RIOT_PASSWORD";
const REGION = "REGION";
const SHARD = "SHARD";

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

// helper function
async function getClientVersion(): Promise<string> {
  const { data } = await axios.get("https://valorant-api.com/v1/version");
  const {
    data: { riotClientVersion },
  } = data;
  return riotClientVersion;
}
```
