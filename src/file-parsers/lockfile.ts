import { type } from "arktype";
import { readFile } from "node:fs/promises";
import { LOCK_FILE_PATH } from "~/helpers/constants";

const lockfile = type({
  user: "string",
  pid: "string",
  port: "string",
  password: "string",
  protocol: "string",
});

export type LockFileData = typeof lockfile.infer;

function parseLockFileContent(content: string): LockFileData {
  const match = content.match(
    /(?<user>.*):(?<pid>.*):(?<port>.*):(?<password>.*):(?<protocol>.*)/,
  );

  const data = lockfile(match?.groups);

  if (data instanceof type.errors) {
    throw Error(data.summary);
  }

  return data;
}

export function getLockFileData(
  path: string = LOCK_FILE_PATH,
): Promise<LockFileData> {
  return readFile(path, "utf8").then(parseLockFileContent);
}
