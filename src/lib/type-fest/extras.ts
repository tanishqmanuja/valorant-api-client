import type { SetOptional } from "type-fest/source/set-optional";

export type SetOptionalIfExists<
  T extends object,
  K extends keyof T | (string & {}),
> = T extends {
  [k in K]: any;
}
  ? SetOptional<T, K>
  : T;
