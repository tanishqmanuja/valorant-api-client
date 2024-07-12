![Logo](https://raw.github.com/tanishqmanuja/valorant-api-client/main/assets/vapic-banner.png?maxAge=2592000)

# VAPIC //VALORANT API CLIENT

![NPM Version](https://img.shields.io/npm/v/%40tqman%2Fvalorant-api-client?style=for-the-badge&color=%23ff6961)
![NPM Downloads](https://img.shields.io/npm/dm/%40tqman%2Fvalorant-api-client?style=for-the-badge&color=%23ff6961)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/tanishqmanuja/valorant-api-client/ci.yaml?branch=main&style=for-the-badge&color=%23ff6961)
![GitHub License](https://img.shields.io/github/license/tanishqmanuja/valorant-api-client?style=for-the-badge&color=%23ff6961)

VAPIC is a type safe implementation of an api client for VALORANT. It includes functional wrapper to call all community known endpoints provided by [valorant-api-types](https://www.npmjs.com/package/valorant-api-types).

## 📦 Installation

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

## ⚡ Showcase Features

- [x] Includes all community known [endpoints](https://valapidocs.techchrism.me/).
- [x] Response parsing using zod library.
- [x] Session Cookies Handling using tough-cookie library.
- [x] Re-Auth using `ssid` cookie without resending username/password.
- [x] Riot MFA using Email-Code Method

## 🚀 API Clients

- [Valorant API Client](../docs/valorant-api-client.md) is the recommended way!
- [Auth API Client](../docs/auth-api-client.md)
- [Local API Client](../docs/local-api-client.md)
- [Remote API Client](../docs/remote-api-client.md)

## 📃 Usage/Examples

### 🟠 Local Authentication

```typescript
import { createValorantApiClient } from "@tqman/valorant-api-client";
import { presets } from "@tqman/valorant-api-client/presets";

const vapic = await createValorantApiClient(presets.local);

const puuid = vapic.remote.puuid;
console.log("PUUID", puuid);

const { data: accountAlias } = await vapic.local.getAccountAlias();
console.log("Account Alias", accountAlias);

const { data: compUpdates } = await vapic.remote.getCompetitiveUpdates({
  data: {
    puuid,
  },
});
console.log("Comp Updates", compUpdates);
```

> [!NOTE]
> VALORANT should be running for lockfile and logfile to be generated.

### 🟣 Remote Authentication

```typescript
import { createValorantApiClient } from "@tqman/valorant-api-client";
import { presets } from "@tqman/valorant-api-client/presets";

const RIOT_USERNAME = "YOUR_USERNAME";
const RIOT_PASSWORD = "YOUR_PASSWORD";

const vapic = await createValorantApiClient(
  presets.remote.with({
    username: RIOT_USERNAME,
    password: RIOT_PASSWORD,
  }),
);

const puuid = vapic.remote.puuid;
console.log("PUUID", puuid);

const { data: compUpdates } = await vapic.remote.getCompetitiveUpdates({
  data: {
    puuid,
  },
});
console.log("CompUpdates", compUpdates);
```

## ❤️‍🔥 Infinite Thanks

- [**@techchrism**](https://github.com/techchrism) for [valorant-api-docs](https://github.com/techchrism/valorant-api-docs)

## 🌿 Show your Support

Give a ⭐️ if this project helped you! \
It will give me motivation for working towards this project.

## ⚖️ Disclaimer

THIS PROJECT IS NOT ASSOCIATED OR ENDORSED BY RIOT GAMES. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc. Whilst effort has been made to abide by Riot's API rules; you acknowledge that use of this software is done so at your own risk.
