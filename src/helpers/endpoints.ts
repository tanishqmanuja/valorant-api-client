import type { RemoteServerType } from "@/helpers/servers";

/* BASE ENDPOINT */

export type ValorantEndpointType = "local" | RemoteServerType;
export type Method = "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
export type ValorantEndpointDef<
  TType extends ValorantEndpointType = ValorantEndpointType,
  TUrl extends string = string,
  TMethods extends Method[] = Method[],
> = {
  ["~type"]: TType;
  url: TUrl;
  methods: TMethods;
};

/* LOCAL ENDPOINT */

export type LocalEndpointDef<
  TUrl extends string = string,
  TMethods extends Method[] = Method[],
> = ValorantEndpointDef<"local", TUrl, TMethods>;

export function createLocalEndpoint<
  const TUrl extends LocalEndpointDef["url"],
  const TMethods extends LocalEndpointDef["methods"] = Method[],
>(opts: { url: TUrl; methods: TMethods }) {
  return {
    ["~type"]: "local",
    url: opts.url,
    methods: opts.methods,
  } as const satisfies LocalEndpointDef;
}

/* REMOTE ENDPOINT */

export type RemoteEndpointDef<
  TType extends RemoteServerType = RemoteServerType,
  TUrl extends string = string,
  TMethods extends Method[] = Method[],
> = ValorantEndpointDef<TType, TUrl, TMethods>;

export function createRemoteEndpoint<
  const TType extends RemoteServerType,
  const TUrl extends RemoteEndpointDef<TType>["url"],
  const TMethods extends RemoteEndpointDef<TType>["methods"] = Method[],
>(opts: { type: TType; url: TUrl; methods: TMethods }) {
  return {
    ["~type"]: opts.type,
    url: opts.url,
    methods: opts.methods,
  } as const satisfies RemoteEndpointDef<TType>;
}
