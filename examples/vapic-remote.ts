import {
  createValorantApiClient,
  isCloudflareError,
} from "@tqman/valorant-api-client";
import { presets } from "@tqman/valorant-api-client/presets";

const RIOT_USERNAME = process.env.RIOT_USERNAME ?? "YOUR_USERNAME";
const RIOT_PASSWORD = process.env.RIOT_PASSWORD ?? "YOUR_PASSWORD";

if (!RIOT_USERNAME || !RIOT_PASSWORD) {
  console.log("Please set RIOT_USERNAME and RIOT_PASSWORD");
  process.exit(0);
}

console.log("Riot Username", RIOT_USERNAME);
console.log(
  "Riot Password",
  RIOT_PASSWORD.slice(0, 3) + "*".repeat(RIOT_PASSWORD.length - 3),
  "\n",
);

process.on("uncaughtException", error => {
  if (isCloudflareError(error)) {
    console.log("Blocked by Cloudflare");
  }
  process.exit(0);
});

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
console.log("Comp Updates", compUpdates);
