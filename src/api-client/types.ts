import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { Fn, Objects, Pipe, Strings } from "hotscript";
import type {
  ConditionalPick,
  EmptyObject,
  ReadonlyDeep,
  ValueOf,
} from "type-fest";
import type { ValorantEndpoint, endpoints } from "valorant-api-types";
import type z from "zod";

type Endpoints = typeof endpoints;
type LocalEndpoints = ConditionalPick<Endpoints, { type: "local" }>;
type RemoteEndpoints = ConditionalPick<
  Endpoints,
  { type: "glz" | "pd" | "shared" }
>;

type HttpMethod<E extends ValorantEndpoint> = Pipe<
  E["method"] extends string ? E["method"] : "GET",
  [Strings.Lowercase]
>;

type EndpointName<E extends ValorantEndpoint> = Pipe<
  E["name"],
  [Strings.Capitalize, Strings.Replace<" ", "">]
>;

type Name<K extends keyof Endpoints> = `${HttpMethod<
  Endpoints[K]
>}${EndpointName<Endpoints[K]>}`;

interface NameFn extends Fn {
  return: Name<this["arg0"]>;
}

type SuffixParamsToData<Re extends string> = Re extends ""
  ? {}
  : Re extends `{${infer key}}${infer rest}`
  ? { [k in key]: string } & SuffixParamsToData<rest>
  : Re extends `${infer _}{${infer rest}`
  ? SuffixParamsToData<`{${rest}`>
  : {};

type SuffixData<E extends ValorantEndpoint> = SuffixParamsToData<E["suffix"]>;
type BodyData<E extends ValorantEndpoint> = E["body"] extends z.ZodType
  ? z.infer<E["body"]>
  : {};
type AxiosRequestData<E extends ValorantEndpoint> = SuffixData<E> & BodyData<E>;

type ZodApiResponse<K extends Record<string, z.ZodType>> = Promise<
  AxiosResponse<z.output<ValueOf<K>>>
>;

export interface AxiosRequestConfigWithData<D = any>
  extends AxiosRequestConfig<D> {
  data: D;
}

interface ImplementationFn extends Fn {
  return: AxiosRequestData<this["arg0"]> extends EmptyObject
    ? (config?: AxiosRequestConfig) => ZodApiResponse<this["arg0"]["responses"]>
    : (
        config: AxiosRequestConfigWithData<AxiosRequestData<this["arg0"]>>
      ) => ZodApiResponse<this["arg0"]["responses"]>;
}

type ApiClient<T extends Record<string, ValorantEndpoint>> = ReadonlyDeep<
  Pipe<T, [Objects.MapKeys<NameFn>, Objects.MapValues<ImplementationFn>]>
>;

export type LocalApiClient = ApiClient<LocalEndpoints>;
export type RemoteApiClient = ApiClient<RemoteEndpoints>;
