![Logo](https://raw.github.com/tanishqmanuja/valorant-api-client/main/assets/VAPIC-banner.png?maxAge=2592000)

# VAPIC //VALORANT API CLIENT

VAPIC is a type safe implementation of an api client for VALORANT. It includes functional wrapper to call all community known endpoints provided by [valorant-api-types](https://www.npmjs.com/package/valorant-api-types).

## Installation

Install @tqman/vapic with npm, pnpm or yarn

```bash
  npm i @tqman/vapic
```

```bash
  pnpm add @tqman/vapic
```

```bash
  yarn add @tqman/vapic
```

## Showcase Features

- [x] Session Cookies Handling using tough-cookie library.
- [x] Re-Auth using `ssid` cookie without resending username/password.
- [x] Riot MFA using Email

## API Clients

- [Valorant API Client](../docs/valorant-api-client.md) is the recommended way!
- [Auth API Client](../docs/auth-api-client.md)
- [Local API Client](../docs/local-api-client.md)
- [Remote API Client](../docs/remote-api-client.md)

## Usage/Examples

**Local Authentication Example** \
NOTE: Your game (VALORANT.exe) should be running for lockfile and logfile to be generated.

```typescript
import {
  createValorantApiClient,
  provideLockFile,
  provideLogFile,
  provideRemoteAuthViaLocalApi,
} from "@tqman/vapic";

// Create Valorant API Client

const vapic = await createValorantApiClient({
  local: useProviders([provideLockFile()]),
  remote: useProviders([provideLogFile(), provideAuthViaLocalApi()]),
});

// Use API Client

const puuid = vapic.remote.getPuuid();

const { data: compUpdates } = await vapic.remote.api.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
```

**Remote Authentication Example**

```typescript
import {
  provideClientVersionViaVAPI,
  provideRemoteAuth,
  createValorantApiClient,
  provideRegion,
} from "@tqman/vapic";

// Change as per your requirement
const RIOT_USERNAME = "YOUR_USERNAME";
const RIOT_PASSWORD = "YOUR_PASSWORD";
const REGION = "YOUR_REGION";
const SHARD = "YOUR_SHARD";

// Create Valorant API Client

const vapic = await createValorantApiClient({
  remote: useProviders([
    provideClientVersionViaVAPI(),
    provideRegion(REGION, SHARD),
    provideAuth(RIOT_USERNAME, RIOT_PASSWORD),
  ]),
});

// Use API Client

const puuid = vapic.remote.getPuuid();

const { data: compUpdates } = await vapic.remote.api.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
```

**Removing Zod Parsing**

```typescript
// For Entire Client Instance
const vapic = await createValorantApiClient({
  remote: useProviders([
    provideClientVersionViaVAPI(),
    provideRegion(REGION, SHARD),
    provideAuth(RIOT_USERNAME, RIOT_PASSWORD),
    () => ({ zodParseResponse: false }),
  ]),
});

// For Single API Call
const { data: compUpdates } = await vapic.remote.api.getCompetitiveUpdates({
  data: {
    puuid,
  },
  zodParseResponse: false,
});
```

## Infinite Thanks ❤️‍🔥

[valorant-api-docs](https://github.com/techchrism/valorant-api-docs)

## Authors

- [@tanishqmanuja](https://www.github.com/tanishqmanuja)

## Show your Support

Give a ⭐️ if this project helped you! \
It will give me motivation for working towards this project.

## Disclaimer

THIS PROJECT IS NOT ASSOCIATED OR ENDORSED BY RIOT GAMES. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc. Whilst effort has been made to abide by Riot's API rules; you acknowledge that use of this software is done so at your own risk.
