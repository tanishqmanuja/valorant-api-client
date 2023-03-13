import {
  createValorantApiClient,
  provideLockFile,
  provideLogFile,
  provideAuthViaLocalApi,
  useProviders,
} from "~/index.js";

// Create Valorant API Client

const vapic = await createValorantApiClient({
  local: useProviders([provideLockFile()]),
  remote: useProviders([provideLogFile(), provideAuthViaLocalApi()]),
});

// Use API Client

const puuid = vapic.remote.getPuuid();

const { data: compUpdates } = await vapic.remote.api.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
