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
