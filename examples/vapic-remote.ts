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
