import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import { z } from "zod";

import { platformSchema } from "~/endpoints/common-types";
import type { ValorantEndpoint } from "~/endpoints/schema";
import { HeadersBuilder } from "~/helpers/headers";
import { getServerUrl, type RemoteServerType } from "~/helpers/servers";
import { getPuuidFromAccessToken } from "~/helpers/tokens";
import { buildUrl, getUrlParams } from "~/helpers/url";
import { ensureArray } from "~/utils/array";
import { applyMixins } from "~/utils/classes";
import { stripKeys } from "~/utils/object";

import { DEFAULT_PLATFORM_INFO, DEFAULT_USER_AGENT } from "./constants";
import { RemoteApiEndpoints } from "./endpoints";

export const remoteApiClientOptionsSchema = z.object({
  shard: z.string(),
  region: z.string(),
  accessToken: z.string(),
  entitlementsToken: z.string(),
  clientVersion: z.string(),
  userAgent: z.string().default(DEFAULT_USER_AGENT),
  platformInfo: platformSchema.default(DEFAULT_PLATFORM_INFO),
});

export type RemoteApiClientOptions = z.input<
  typeof remoteApiClientOptionsSchema
>;

export function createRemoteApiClient(options: RemoteApiClientOptions) {
  return new RemoteApiClient(options);
}

export class RemoteApiClient {
  #axios: AxiosInstance;
  #options: z.output<typeof remoteApiClientOptionsSchema>;

  constructor(options: RemoteApiClientOptions) {
    this.#options = remoteApiClientOptionsSchema.parse(options);
    this.#axios = axios.create({
      headers: HeadersBuilder.remote(this.#options),
    });
  }

  reinit(options: RemoteApiClientOptions): void {
    this.#options = remoteApiClientOptionsSchema.parse(options);

    Object.assign(
      this.#axios.defaults.headers,
      HeadersBuilder.remote(this.#options),
    );
  }

  get puuid(): string {
    return getPuuidFromAccessToken(this.options.accessToken);
  }

  get axios() {
    return this.#axios;
  }

  get options() {
    return structuredClone(this.#options);
  }

  getServerUrl(type: RemoteServerType): string {
    const { region, shard } = this.options;
    return getServerUrl({ type, region, shard });
  }

  ["~request"]<
    T extends ValorantEndpoint & { type: RemoteServerType },
    TConfig extends AxiosRequestConfig,
  >(endpoint: T, config: TConfig) {
    return this.axios({
      baseURL: this.getServerUrl(endpoint.type),
      url: buildUrl(endpoint.url, { puuid: this.puuid, ...config.data }),
      method: endpoint.method,
      headers: endpoint.headers,
      ...config,
      transformRequest: [
        (data) => stripKeys(data, getUrlParams(endpoint.url)),
        ...ensureArray(axios.defaults.transformRequest),
        ...ensureArray(config.transformRequest),
      ],
    });
  }
}

applyMixins(RemoteApiClient, [RemoteApiEndpoints]);
export interface RemoteApiClient extends RemoteApiEndpoints {}
