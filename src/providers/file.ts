import type { VapicProvider } from "~/clients/valorant/types";
import { getLockFileData } from "~/file-parsers/lockfile";
import { getLogFileData } from "~/file-parsers/logfile";
import { getRegionAndShardFromGlzServer } from "~/helpers/servers";

/**
 * @client local
 * @provides user, password, port, pid, protocol
 */
export function provideLockFile(lockfilePath?: string) {
  return (async () => {
    const lockfile = await getLockFileData(lockfilePath);
    return { ...lockfile };
  }) satisfies VapicProvider;
}

/**
 * @client remote
 * @provides shard, region, client-version
 */
export function provideLogFile(logfilePath?: string) {
  return (async () => {
    const logfile = await getLogFileData(logfilePath);

    return {
      ...logfile,
      ...getRegionAndShardFromGlzServer(logfile.servers.glz),
    };
  }) satisfies VapicProvider;
}
