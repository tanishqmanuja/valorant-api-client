import { array as A, either as E, option as O, taskEither as TE } from "fp-ts";
import RE from "fp-ts-contrib/lib/RegExp.js";
import { sequenceS } from "fp-ts/lib/Apply.js";
import { pipe } from "fp-ts/lib/function.js";
import z from "zod";

import { LOG_FILE_PATH } from "~/helpers/constants.js";
import { REMOTE_SERVER_TYPES, RemoteServerType } from "~/helpers/servers.js";
import { getFileContents } from "~/utils/lib/fp-ts/fileSystem.js";
import { toPromise } from "~/utils/lib/fp-ts/taskEither.js";
import { ReplaceValueAny } from "~/utils/lib/typescript/object.js";

const LogFileData = z.object({
  clientVersion: z.string(),
  servers: z.object(
    REMOTE_SERVER_TYPES.reduce(
      (acc, type) => Object.assign(acc, { [type]: z.string() }),
      {} as Record<RemoteServerType, z.ZodString>
    )
  ),
});

export type LogFileData = z.infer<typeof LogFileData>;

type LogFileServerData = LogFileData["servers"];

type LogFileDataLike<T = unknown> = ReplaceValueAny<LogFileData, T>;
type LogFileServerDataLike<T = unknown> = ReplaceValueAny<LogFileServerData, T>;

const splitByLine = (str: string) => str.split(/\r?\n/);

function find<A>(predicate: (a: A) => boolean): (as: Array<A>) => O.Option<A> {
  return (as: Array<A>) => O.fromNullable(as.find(predicate));
}

function parseClientVersion(content: string): E.Either<Error, string> {
  const VersionSchema = z.object({
    patch: z.string(),
    buildType: z.string(),
    buildVersion: z.string(),
    changelist: z.string(),
  });

  return pipe(
    content,
    O.fromNullable,
    O.map(splitByLine),
    O.chain(find(line => line.includes("CI server version:"))),
    O.chain(
      RE.match(
        /CI server version: (?<buildType>.*)-(?<patch>.*)-(?<buildVersion>.*)-(?<changelist>.*)/
      )
    ),
    E.fromOption(() => {
      return Error("Version line not found");
    }),
    E.chain(({ groups }) =>
      E.tryCatch(() => VersionSchema.parse(groups), E.toError)
    ),
    E.map(
      ({ patch, buildType, buildVersion, changelist }) =>
        `${buildType}-${patch}-shipping-${buildVersion}-${changelist}`
    )
  );
}

function parseServer(content: string, type: RemoteServerType) {
  return pipe(
    content,
    O.fromNullable,
    O.map(splitByLine),
    O.chain(
      find(
        line => line.includes(`https://${type}`) && line.includes(".a.pvp.net/")
      )
    ),
    O.chain(RE.match(RegExp(`https:\/\/${type}.*?\.a\.pvp\.net`))),
    O.chain(A.head),
    E.fromOption(() => {
      return Error(`Server type ${type} not found`);
    })
  );
}

function parseLogFileContent(content: string): E.Either<Error, LogFileData> {
  return pipe(
    content,
    c =>
      sequenceS(E.Apply)({
        clientVersion: parseClientVersion(c),
        servers: sequenceS(E.Apply)({
          glz: parseServer(c, "glz"),
          pd: parseServer(c, "pd"),
          shared: parseServer(c, "shared"),
        } satisfies LogFileServerDataLike),
      } satisfies LogFileDataLike),
    E.map(LogFileData.parse)
  );
}

export function getLogFileDataTE(
  logFilePath: string = LOG_FILE_PATH
): TE.TaskEither<Error, LogFileData> {
  return pipe(
    logFilePath,
    getFileContents,
    TE.chainEitherK(parseLogFileContent)
  );
}

export function getLogFileData(
  logFilePath: string = LOG_FILE_PATH
): Promise<LogFileData | undefined> {
  return pipe(getLogFileDataTE(logFilePath), toPromise());
}
