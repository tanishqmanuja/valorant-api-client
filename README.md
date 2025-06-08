![Logo](https://raw.github.com/tanishqmanuja/static/main/banners/vapic-v3.png?maxAge=2592000)

# VAPIC //VALORANT API CLIENT

![NPM Version](https://img.shields.io/npm/v/%40tqman%2Fvalorant-api-client?style=for-the-badge&color=%23ff6961)
![NPM Downloads](https://img.shields.io/npm/dm/%40tqman%2Fvalorant-api-client?style=for-the-badge&color=%23ff6961)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/tanishqmanuja/valorant-api-client/ci.yaml?branch=main&style=for-the-badge&color=%23ff6961)
![GitHub License](https://img.shields.io/github/license/tanishqmanuja/valorant-api-client?style=for-the-badge&color=%23ff6961)

VAPIC is a type safe implementation of an api client for VALORANT. It includes functional wrapper to call all community known endpoints provided by [valorant-api-types](https://www.npmjs.com/package/valorant-api-types).

## 📦 Installation

```sh
npm i @tqman/valorant-api-client@next
```

```sh
pnpm add @tqman/valorant-api-client@next
```

## 📝 Usage

```ts
import { createValorantApiClient } from "@tqman/valorant-api-client";

const v = createValorantApiClient({ initializer: "local" });

const { data: help } = await v.local.request("/help");
console.log(help);
```

Check out the [examples](https://github.com/tanishqmanuja/valorant-api-client/tree/main/examples) folder for better understanding.

## 🌿 Show your Support

Give a ⭐️ if this project helped you!

## ❤️‍🔥 Infinite Thanks

- [**@techchrism**](https://github.com/techchrism) for [valorant-api-docs](https://github.com/techchrism/valorant-api-docs)
- [**@floxay**](https://github.com/floxay)

## 📃 Disclaimer

THIS PROJECT IS NOT ASSOCIATED OR ENDORSED BY RIOT GAMES. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc. Whilst effort has been made to abide by Riot's API rules; you acknowledge that use of this software is done so at your own risk.
