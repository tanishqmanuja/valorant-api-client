import { createLocalApiClient } from "./api-client/local.js";
import { createRemoteApiClient } from "./api-client/remote.js";
import { getLockFileDataPromise } from "./file-parser/lockfile.js";
import { getLogFileDataPromise } from "./file-parser/logfile.js";
import { getRegionAndShardFromGlzServer } from "./helpers/servers.js";

const lockfile = await getLockFileDataPromise();
const logfile = await getLogFileDataPromise();

if (lockfile && logfile) {
  const { password, port } = lockfile;
  const localAPI = createLocalApiClient({ password, port });

  const { version, servers } = logfile;
  const { shard, region } = getRegionAndShardFromGlzServer(servers.glz);

  const {
    data: { accessToken: token, token: entitlement, subject: selfPuuid },
  } = await localAPI.getEntitlementsToken();

  const remoteAPI = createRemoteApiClient({
    shard,
    region,
    token,
    entitlement,
    version,
  });

  const { data: partyPlayer } = await remoteAPI.getPartyPlayer({
    data: { puuid: selfPuuid },
  });

  console.log(partyPlayer);
}
