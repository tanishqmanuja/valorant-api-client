import {
  createValorantApiClient,
  provideLockFile,
  provideLogFile,
  provideRemoteAuthViaLocalApi,
} from "~/index";

const vapic = await createValorantApiClient({
  local: {
    providers: [provideLockFile()],
  },
  remote: {
    providers: [provideLogFile(), provideRemoteAuthViaLocalApi()],
  },
});

const {
  data: { userInfo },
} = await vapic.local.api.getRSOUserInfo<{ userInfo: string }>({
  zodParseResponse: false,
});

// Until Schema is fixed
const puuid = JSON.parse(userInfo).sub;

const { data: compUpdates } = await vapic.remote.api.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
