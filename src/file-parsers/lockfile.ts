import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { z } from "zod";

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
  port: z.string(),
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
  return readFile(path, "utf8").then(parseLockFileContent);
}
