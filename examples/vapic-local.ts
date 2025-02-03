import { createValorantApiClient, presets } from "@tqman/valorant-api-client";

const vapic = await createValorantApiClient(presets.local).catch(() => {
  console.warn("Please make your VALORANT is running!");
  process.exit(1);
});

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
