import {
  provideClientVersionViaVAPI,
  provideRemoteAuth,
  createValorantApiClient,
  provideRegion,
  getAccessTokenHeader,
} from "~/index";

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
      provideRemoteAuth(RIOT_USERNAME, RIOT_PASSWORD),
    ],
  },
});

const { accessToken } = vapic.remote.helpers.getOptions();

const { data: playerInfo } = await vapic.auth.api.getPlayerInfo({
  headers: {
    ...getAccessTokenHeader(accessToken),
  },
});

const puuid = playerInfo.sub;

const { data: compUpdates } = await vapic.remote.api.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
