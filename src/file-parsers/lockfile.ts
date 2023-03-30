import { either as E, taskEither as TE } from "fp-ts";
import { pipe } from "fp-ts/lib/function.js";
import z from "zod";

import { LOCK_FILE_PATH } from "~/helpers/constants.js";
import { getFileContents } from "~/utils/lib/fp-ts/fileSystem.js";
import { toPromise } from "~/utils/lib/fp-ts/taskEither.js";

const LockFileData = z.object({
  user: z.string(),
  pid: z.string(),
  port: z.string(),
  password: z.string(),
  protocol: z.string(),
});

export type LockFileData = z.infer<typeof LockFileData>;

function parseLockFileContent(content: string) {
  const matches = content.match(
    /(?<user>.*):(?<pid>.*):(?<port>.*):(?<password>.*):(?<protocol>.*)/
  );
  return E.tryCatch(() => LockFileData.parse(matches?.groups), E.toError);
}

export function getLockFileDataTE(
  lockfilePath: string = LOCK_FILE_PATH
): TE.TaskEither<Error, LockFileData> {
  return pipe(
    lockfilePath,
    getFileContents,
    TE.chainEitherK(parseLockFileContent)
  );
}

export function getLockFileData(
  lockfilePath: string = LOCK_FILE_PATH
): Promise<undefined | LockFileData> {
  return pipe(getLockFileDataTE(lockfilePath), toPromise());
}
