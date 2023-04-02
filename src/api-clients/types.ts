import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { Call, Fn, Objects, Pipe, Strings } from "hotscript";
import type { ConditionalPick, EmptyObject, ValueOf } from "type-fest";
import type { ValorantEndpoint, endpoints } from "valorant-api-types";
import type z from "zod";

type Endpoints = typeof endpoints;
type LocalEndpoints = ConditionalPick<Endpoints, { type: "local" }>;
type RemoteEndpoints = ConditionalPick<
  Endpoints,
  { type: "glz" | "pd" | "shared" }
>;
type AuthEndpoints = ConditionalPick<
  Endpoints,
  { type: "other"; category: "Authentication Endpoints" }
>;

type HttpMethod<E extends ValorantEndpoint> = Pipe<
  E["method"] extends string ? E["method"] : "GET",
  [Strings.Lowercase]
>;

type EndpointName<E extends ValorantEndpoint> = Pipe<
  E["name"],
  [Strings.Replace<" ", "-">, Strings.CamelCase, Strings.Capitalize]
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

interface MapSuffixKeys extends Fn {
  return: Pipe<this["arg0"], [Strings.Replace<" ", "-">, Strings.CamelCase]>;
}

type SuffixData<E extends ValorantEndpoint> = Call<
  Objects.MapKeys<MapSuffixKeys>,
  SuffixParamsToData<E["suffix"]>
>;
type BodyData<E extends ValorantEndpoint> = E["body"] extends z.ZodType
  ? z.infer<E["body"]>
  : {};
type AxiosRequestData<E extends ValorantEndpoint> = SuffixData<E> & BodyData<E>;

type ZodApiResponse<K> = Promise<
  K extends Record<string, z.ZodType>
    ? AxiosResponse<z.output<ValueOf<K>>>
    : AxiosResponse<K>
>;

export interface AxiosRequestConfigWithData<D = any>
  extends AxiosRequestConfig<D> {
  data: D;
}

export type CustomAxiosRequestConfig = {
  zodParseResponse?: boolean;
};

interface ImplementationFn extends Fn {
  return: AxiosRequestData<this["arg0"]> extends EmptyObject
    ? <DataType = this["arg0"]["responses"]>(
        config?: AxiosRequestConfig & CustomAxiosRequestConfig
      ) => ZodApiResponse<DataType>
    : <DataType = this["arg0"]["responses"]>(
        config: AxiosRequestConfigWithData<AxiosRequestData<this["arg0"]>> &
          CustomAxiosRequestConfig
      ) => ZodApiResponse<DataType>;
}

type Api<T extends Record<string, ValorantEndpoint>> = Pipe<
  T,
  [Objects.MapKeys<NameFn>, Objects.MapValues<ImplementationFn>]
>;

export type LocalApi = Api<LocalEndpoints>;
export type RemoteApi = Api<RemoteEndpoints>;
export type AuthApi = Api<AuthEndpoints>;
