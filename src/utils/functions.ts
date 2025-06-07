import type { HasRequiredKeys } from "type-fest";

export type ArgsIfRequired<T extends object> =
  HasRequiredKeys<T> extends true ? [T] : [T?];
