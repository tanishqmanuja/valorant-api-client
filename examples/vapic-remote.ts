import {
  provideClientVersionViaVAPI,
  provideAuth,
  createValorantApiClient,
  provideRegion,
} from "~/index.js";

const RIOT_USERNAME = process.env.RIOT_USERNAME;
const RIOT_PASSWORD = process.env.RIOT_PASSWORD;

// change as per your requirement
const REGION = "ap";
const SHARD = "ap";

if (!(RIOT_USERNAME && RIOT_PASSWORD)) {
  console.log("Error: Provide username and password");
  console.log("Either edit the script or use ENV variables.");
  console.log(
    `For setting ENV variables in Powershell use,\n($env:RIOT_USERNAME="123") -and ($env:RIOT_PASSWORD="XYZ")`
  );
  process.exit(1);
}

// main code starts here ...

const vapic = await createValorantApiClient({
  remote: {
    providers: [
      provideClientVersionViaVAPI(),
      provideRegion(REGION, SHARD),
      provideAuth(RIOT_USERNAME, RIOT_PASSWORD),
    ],
  },
});

const puuid = vapic.remote.getPuuid();

const { data: compUpdates } = await vapic.remote.api.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
