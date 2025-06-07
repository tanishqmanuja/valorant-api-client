import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { z } from "zod/v4";

export class LockFileNotFoundError extends Error {}

export const LOCK_FILE_PATH = join(
  process.env.LOCALAPPDATA ?? "",
  "Riot Games",
  "Riot Client",
  "Config",
  "lockfile",
);

const lockfileSchema = z.object({
  user: z.string(),
  pid: z.string(),
  port: z.coerce.number(),
  password: z.string(),
  protocol: z.string(),
});

export type LockFileData = z.output<typeof lockfileSchema>;

function parseLockFileContent(content: string): LockFileData {
  const match = content.match(
    /(?<user>.*):(?<pid>.*):(?<port>.*):(?<password>.*):(?<protocol>.*)/,
  );

  return lockfileSchema.parse(match?.groups);
}

export function getLockFileData(
  path: string = LOCK_FILE_PATH,
): Promise<LockFileData> {
  return readFile(path, "utf8")
    .catch(e => {
      throw new LockFileNotFoundError(path, { cause: e });
    })
    .then(parseLockFileContent);
}
