import { toError } from "fp-ts/lib/Either.js";
import { tryCatch } from "fp-ts/lib/TaskEither.js";
import { readFile } from "node:fs/promises";

export const getFileContents = (path: string) =>
  tryCatch(() => readFile(path, "utf-8"), toError);
