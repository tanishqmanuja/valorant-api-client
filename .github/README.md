![Logo](https://raw.github.com/tanishqmanuja/valorant-api-client/main/assets/vapic-banner.png?maxAge=2592000)

<p align="center">
  <a href="https://github.com/tanishqmanuja/valorant-api-client">
      <img src="https://img.shields.io/github/actions/workflow/status/tanishqmanuja/valorant-api-client/ci.yaml?style=flat&logo=github&label=CI" alt="CI Status" height="18">
  </a>
  <a href="https://www.npmjs.com/package/@tqman/valorant-api-client">
    <img src="https://img.shields.io/npm/dm/@tqman/valorant-api-client.svg?style=flat&label=Downloads" alt="downloads" height="18">
  </a>
  <a href="https://www.npmjs.com/package/@tqman/valorant-api-client">
    <img src="https://img.shields.io/npm/v/@tqman/valorant-api-client.svg?style=flat&label=NPM" alt="npm version" height="18">
  </a>
  <a href="https://github.com/tanishqmanuja/valorant-api-client">
    <img src="https://img.shields.io/npm/l/@tqman/valorant-api-client.svg?style=flat&label=License" alt="MIT license" height="18">
  </a>
</p>

# VAPIC //VALORANT API CLIENT

VAPIC is a type safe implementation of an api client for VALORANT. It includes functional wrapper to call all community known endpoints provided by [valorant-api-types](https://www.npmjs.com/package/valorant-api-types).

## Installation

Install @tqman/valorant-api-client with npm, pnpm or yarn

```sh
npm i @tqman/valorant-api-client@latest
```

```sh
pnpm add @tqman/valorant-api-client@latest
```

```sh
yarn add @tqman/valorant-api-client@latest
```

## Showcase Features

- [x] Includes all community known [endpoints](https://valapidocs.techchrism.me/).
- [x] Response parsing using zod library.
- [x] Session Cookies Handling using tough-cookie library.
- [x] Re-Auth using `ssid` cookie without resending username/password.
- [x] Riot MFA using Email-Code Method

## API Clients

- [Valorant API Client](../docs/valorant-api-client.md) is the recommended way!
- [Auth API Client](../docs/auth-api-client.md)
- [Local API Client](../docs/local-api-client.md)
- [Remote API Client](../docs/remote-api-client.md)

## Usage/Examples

### > Local Authentication

```typescript
import {
  createValorantApiClient,
  provideLockFile,
  provideLogFile,
  provideRemoteAuthViaLocalApi,
  provideClientVersionViaVAPI,
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

> NOTE: Your game (VALORANT.exe) should be running for lockfile and logfile to be generated.

### > Remote Authentication

```typescript
import {
  provideClientVersionViaVAPI,
  provideClientVersionViaAuthApi,
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

## Infinite Thanks ❤️‍🔥

[valorant-api-docs](https://github.com/techchrism/valorant-api-docs)

## Authors

- [@tanishqmanuja](https://www.github.com/tanishqmanuja)

## Show your Support

Give a ⭐️ if this project helped you! \
It will give me motivation for working towards this project.

## Disclaimer

THIS PROJECT IS NOT ASSOCIATED OR ENDORSED BY RIOT GAMES. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc. Whilst effort has been made to abide by Riot's API rules; you acknowledge that use of this software is done so at your own risk.
