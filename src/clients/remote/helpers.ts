import {
  createRemoteEndpoint,
  type RemoteEndpointDef,
} from "@/helpers/endpoints";

export function getPuuidFromAccessToken(accessToken: string): string {
  return JSON.parse(
    Buffer.from(accessToken.split(".")[1]!, "base64").toString(),
  ).sub;
}

export const G = <
  const TUrl extends RemoteEndpointDef["url"],
  const TMethods extends RemoteEndpointDef["methods"],
>(
  url: TUrl,
  methods: TMethods,
) => createRemoteEndpoint({ type: "glz", url, methods });

export const P = <
  const TUrl extends RemoteEndpointDef["url"],
  const TMethods extends RemoteEndpointDef["methods"],
>(
  url: TUrl,
  methods: TMethods,
) => createRemoteEndpoint({ type: "pd", url, methods });

export const S = <
  const TUrl extends RemoteEndpointDef["url"],
  const TMethods extends RemoteEndpointDef["methods"],
>(
  url: TUrl,
  methods: TMethods,
) => createRemoteEndpoint({ type: "shared", url, methods });
