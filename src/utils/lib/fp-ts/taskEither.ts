import { task as T, taskEither as TE } from "fp-ts";
import { pipe } from "fp-ts/lib/function.js";
import { isNativeError } from "node:util/types";

export function toPromise<T, L>(): (
  te: TE.TaskEither<Error, T>
) => Promise<T | L>;
export function toPromise<T, L>(
  errorHandler: (e: Error) => L
): (te: TE.TaskEither<Error, T>) => Promise<T | L>;
export function toPromise<T, L, R>(
  errorHandler: (e: Error) => L,
  valueHandler: (value: T) => R
): (te: TE.TaskEither<Error, T>) => Promise<L | R>;
export function toPromise<T, L, R>(
  errorHandler: (e: Error) => unknown = () => {},
  valueHandler?: (value: T) => R
) {
  return async (te: TE.TaskEither<Error, T>) => {
    const output = await pipe(te, TE.foldW(T.of, T.of), t => t());

    if (isNativeError(output)) {
      return errorHandler(output);
    }
    if (valueHandler) {
      return valueHandler(output);
    }
    return output;
  };
}
