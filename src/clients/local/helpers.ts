import {
  createLocalEndpoint,
  type LocalEndpointDef,
} from "@/helpers/endpoints";

export const L = <
  const TUrl extends LocalEndpointDef["url"],
  const TMethods extends LocalEndpointDef["methods"],
>(
  url: TUrl,
  methods: TMethods,
) => createLocalEndpoint({ url, methods });
