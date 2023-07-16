# Remote API Client

Api wrapper for calling remote endpoints.

> Remote endpoints includes shared, glz, pd endpoints

## Options

- `accessToken` **(REQUIRED)** - string
- `entitlementsToken` **(REQUIRED)** - string
- `shard` **(REQUIRED)** - string
- `region` **(REQUIRED)** - string
- `clientVersion` **(REQUIRED)** - string
- `platformInfo` **(optional)** - PlatformSchema
- `userAgent` **(optional)** - string
- `zodParseResponse` **(optional)** - boolean

## Options Type

```ts
type RemoteApiClientOptions = {
  region: string;
  shard: string;
  parseResponseData?: boolean;
  accessToken: string;
  entitlementsToken: string;
  clientVersion: string;
  userAgent?: string;
  platformInfo?: {
    platformType: "PC";
    platformOS: "Windows";
    platformOSVersion: string;
    platformChipset: "Unknown";
  };
};
```

## Usage

### > Using Local API

```typescript
const lockfile = await getLockFileDataPromise();
const logfile = await getLogFileDataPromise();

if (!(lockfile && logfile)) {
  console.log("Lockfile or Logfile not found!");
  process.exit(1);
}

const { password, port } = lockfile;
const local = new LocalApiClient({
  password,
  port,
});

const { clientVersion, servers } = logfile;
const { shard, region } = getRegionAndShardFromGlzServer(servers.glz);

const {
  data: { accessToken, token: entitlementsToken, subject: selfPuuid },
} = await local.getEntitlementsToken();

console.log("PUUID", selfPuuid);

const remote = new RemoteApiClient({
  shard,
  region,
  accessToken,
  entitlementsToken,
  clientVersion,
});

const { data: mmr } = await remote.getPlayerMMR({
  data: { puuid: selfPuuid },
});

console.log(mmr);
```

### > Using Auth Api

```typescript
// change as per your requirement
const RIOT_USERNAME = "RIOT_USERNAME";
const RIOT_PASSWORD = "RIOT_PASSWORD";
const REGION = "REGION";
const SHARD = "SHARD";

const auth = new AuthApiClient();

const cookieResponse = await auth.postAuthCookies({
  data: {
    client_id: "play-valorant-web-prod",
    nonce: "1",
    redirect_uri: "https://playvalorant.com/opt_in",
    response_type: "token id_token",
    scope: "account openid",
  },
});

const tokenResponse = await auth.putAuthRequest({
  data: {
    language: "en_US",
    remember: true,
    type: "auth",
    username: RIOT_USERNAME,
    password: RIOT_PASSWORD,
  },
});

const { accessToken } = parseTokensFromResponse(tokenResponse);
const selfPuuid = getPuuidFromAccessToken(accessToken);

const entitlementResponse = await auth.postEntitlement({
  headers: {
    ...getAccessTokenHeader(accessToken),
    ...getJsonHeader(),
  },
});

const entitlementsToken = parseEntitlementsToken(entitlementResponse);

const remote = new RemoteApiClient({
  clientVersion: await getClientVersion(),
  ...getRegionOptions(REGION, SHARD),
  accessToken,
  entitlementsToken,
});

console.log("PUUID", selfPuuid);

const { data: competitiveUpdates } = await remote
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
