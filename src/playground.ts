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

  const { version, servers } = logfile;
  const { shard, region } = getRegionAndShardFromGlzServer(servers.glz);

  const {
    data: { accessToken: token, token: entitlement, subject: selfPuuid },
  } = await localAPI.getEntitlementsToken();

  const { api: remoteAPI } = createRemoteApiClient({
    shard,
    region,
    token,
    entitlement,
    version,
  });

  const { data: mmr } = await remoteAPI.getPlayerMMR({
    data: { puuid: selfPuuid },
  });

  console.log(JSON.stringify(mmr));
}
