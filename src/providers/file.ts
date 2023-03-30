import { getLockFileData } from "~/file-parsers/lockfile.js";
import { getLogFileData } from "~/file-parsers/logfile.js";
import { getRegionAndShardFromGlzServer } from "~/helpers/servers.js";

export function provideLockFile(lockfilePath?: string) {
  return async () => {
    const lockfile = await getLockFileData(lockfilePath);
    if (!lockfile) {
      throw Error("Unable to get lockfile data");
    }
    return { ...lockfile } as const;
  };
}

export function provideLogFile(logfilePath?: string) {
  return async () => {
    const logfile = await getLogFileData(logfilePath);
    if (!logfile) {
      throw Error("Unable to get logfile data");
    }
    return {
      ...logfile,
      ...getRegionAndShardFromGlzServer(logfile.servers.glz),
    } as const;
  };
}
