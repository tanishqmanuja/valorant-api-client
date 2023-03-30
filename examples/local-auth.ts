import {
  createLocalApiClient,
  createRemoteApiClient,
  getLockFileData,
  getLogFileData,
  getRegionAndShardFromGlzServer,
} from "~/index.js";

const lockfile = await getLockFileData();
const logfile = await getLogFileData();

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

  console.log("PUUID", selfPuuid);

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
