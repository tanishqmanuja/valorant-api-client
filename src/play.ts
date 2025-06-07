import { z } from "zod/v4";

import { LocalApiClient } from "./clients/local";
import { getLockFileData } from "./file-parsers/lockfile";

const lockdata = await getLockFileData();

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

console.log({ accessToken, entitlementsToken });
