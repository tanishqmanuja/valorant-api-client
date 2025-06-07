import type { LocalEndpoint } from "./endpoints";

export type FindEndpoint<TUrl extends string> = Extract<
  LocalEndpoint,
  { url: TUrl }
>;
