import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { AxiosResponse } from "axios";
import type { HasRequiredKeys, IsNever } from "type-fest";

import type { SetOptionalIfExists } from "@/lib/type-fest/extras";
import type { ExtractPathParams, PathOptions } from "@/utils/url/types";

export type UrlConfig<TUrl extends string> = PathOptions<
  SetOptionalIfExists<ExtractPathParams<TUrl>, "puuid">
>;

export type MethodConfig<RequiredMethod extends string | never> =
  IsNever<RequiredMethod> extends true
    ? {}
    : RequiredMethod extends "GET"
      ? { method?: RequiredMethod }
      : { method: RequiredMethod };

export type StandardAxiosResponse<TSchema extends StandardSchemaV1> =
  AxiosResponse<StandardSchemaV1.InferOutput<TSchema>>;

export type ConfigIfRequired<T extends object> =
  HasRequiredKeys<T> extends true ? [config: T] : [config?: T];
