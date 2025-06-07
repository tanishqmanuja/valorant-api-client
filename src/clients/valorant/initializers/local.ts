import z from "zod/v4";

import { LocalApiClient } from "@/clients/local";
import { RemoteApiClient } from "@/clients/remote";
import { getLockFileData } from "@/file-parsers/lockfile";
import { getLogFileData } from "@/file-parsers/logfile";
import { getRegionAndShardFromGlzServer } from "@/helpers/servers";

export async function local() {
  const lockdata = await getLockFileData();
  const logdata = await getLogFileData();

  const local = new LocalApiClient(lockdata);
  const {
    data: { accessToken, token: entitlementsToken },
  } = await local.request("/entitlements/v1/token", {
    schema: z.object({
      token: z.string(),
      accessToken: z.string(),
      subject: z.string(),
    }),
  });

  const remote = new RemoteApiClient({
    ...logdata,
    ...getRegionAndShardFromGlzServer(logdata.servers.glz),
    accessToken,
    entitlementsToken,
  });

  return {
    local,
    remote,
  };
}
