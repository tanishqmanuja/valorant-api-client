import type { RemoteServerType } from "@/helpers/servers";

import type { RemoteEndpoint, RemoteEndpointUrl } from "./endpoints";

export type FindUrl<TType extends string> = TType extends RemoteServerType
  ? RemoteEndpointUrl<TType> | (string & {})
  : string & {};

export type FindEndpoint<
  TUrl extends string,
  TType extends string,
> = TType extends RemoteServerType
  ? Extract<
      RemoteEndpoint<TType>,
      {
        ["~type"]: TType;
        url: TUrl;
      }
    >
  : never;
