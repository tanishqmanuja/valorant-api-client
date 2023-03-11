import {
  createValorantApiClient,
  provideLockFile,
  provideLogFile,
  provideRemoteAuthViaLocalApi,
} from "~/index.js";

// Create Valorant API Client

const vapic = await createValorantApiClient({
  local: {
    providers: [provideLockFile()],
  },
  remote: {
    providers: [provideLogFile(), provideRemoteAuthViaLocalApi()],
  },
});

// Use API Client

const puuid = vapic.remote.getPuuid();

const { data: compUpdates } = await vapic.remote.api.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
