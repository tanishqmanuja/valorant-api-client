# VAPIC //VALORANT API CLIENT

VAPIC is a type safe implementation of an api client for VALORANT. It includes functional wrapper to call all community known endpoints provided by [valorant-api-types](https://www.npmjs.com/package/valorant-api-types).

## Installation

Install @tqman/valorant-api-client with npm, pnpm or yarn

```sh
npm i @tqman/valorant-api-client@latest
```

```sh
pnpm add @tqman/valorant-api-client@lastest
```

```sh
yarn add @tqman/valorant-api-client@latest
```

## Showcase Features

- [x] Response parsing using zod library.
- [x] Session Cookies Handling using tough-cookie library.
- [x] Re-Auth using `ssid` cookie without resending username/password.
- [x] Riot MFA using Email-Code Method

## Usage/Examples

### > Local Authentication

NOTE: Your game (VALORANT.exe) should be running for lockfile and logfile to be generated.

```typescript
import {
  createValorantApiClient,
  provideLockFile,
  provideLogFile,
  provideRemoteAuthViaLocalApi,
} from "@tqman/valorant-api-client";

// Create Valorant API Client
const vapic = await createValorantApiClient({
  auth: useProviders(provideClientVersionViaVAPI()),
  local: useProviders(provideLockFile()),
  remote: useProviders([provideLogFile(), provideAuthViaLocalApi()]),
});

// Use API Client
const puuid = vapic.remote.puuid;
const { data: compUpdates } = await vapic.remote.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
```

### > Remote Authentication

```typescript
import {
  provideClientVersionViaVAPI,
  provideRemoteAuth,
  createValorantApiClient,
  provideRegion,
} from "@tqman/valorant-api-client";

// Change as per your requirement
const RIOT_USERNAME = "YOUR_USERNAME";
const RIOT_PASSWORD = "YOUR_PASSWORD";

// Create Valorant API Client
const vapic = await createValorantApiClient({
  auth: useProviders(provideClientVersionViaVAPI()),
  remote: useProviders([
    provideClientVersionViaAuthApi(),
    provideAuthAutoRegion(RIOT_USERNAME, RIOT_PASSWORD),
  ]),
});

// Use API Client
const puuid = vapic.remote.puuid;
const { data: compUpdates } = await vapic.remote.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
```

## Disclaimer

THIS PROJECT IS NOT ASSOCIATED OR ENDORSED BY RIOT GAMES. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc. Whilst effort has been made to abide by Riot's API rules; you acknowledge that use of this software is done so at your own risk.
