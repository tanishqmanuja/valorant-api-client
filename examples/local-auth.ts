import {
  createLocalApiClient,
  createRemoteApiClient,
  getLockFileDataPromise,
  getLogFileDataPromise,
  getRegionAndShardFromGlzServer,
} from "~/index.js";

const lockfile = await getLockFileDataPromise();
const logfile = await getLogFileDataPromise();

if (lockfile && logfile) {
  const { password, port } = lockfile;
  const { api: localAPI } = createLocalApiClient({
    password,
    port,
  });

  const { clientVersion, servers } = logfile;
  const { shard, region } = getRegionAndShardFromGlzServer(servers.glz);

  const {
    data: { accessToken, token: entitlementsToken, subject: selfPuuid },
  } = await localAPI.getEntitlementsToken();

  const { api: remoteAPI } = createRemoteApiClient({
    shard,
    region,
    accessToken,
    entitlementsToken,
    clientVersion,
  });

  const { data: mmr } = await remoteAPI.getPlayerMMR({
    data: { puuid: selfPuuid },
  });

  console.log(mmr);
}
