import { z } from "zod";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { platformSchema } from "valorant-api-types";

import { applyMixins } from "~/utils/classes";
import {
  type RemoteServerType,
  getServerUrl,
  getPuuidFromAccessToken,
  DEFAULT_PLATFORM_INFO,
  DEFAULT_USER_AGENT,
} from "~/helpers";

import { RemoteApiEndpoints } from "./endpoints";
import { getRemoteApiClientAxios } from "./helpers";
import type { CustomAxiosRequestConfig } from "..";

export const remoteApiClientOptionsSchema = z.object({
  shard: z.string(),
  region: z.string(),
  accessToken: z.string(),
  entitlementsToken: z.string(),
  clientVersion: z.string(),
  userAgent: z.string().default(DEFAULT_USER_AGENT),
  platformInfo: platformSchema.default(DEFAULT_PLATFORM_INFO),
  parseResponseData: z.boolean().default(false),
});

export type RemoteApiClientOptions = z.input<
  typeof remoteApiClientOptionsSchema
>;

/**
 * @description functional wrapper for RemoteApiClient
 */
export function createRemoteApiClient(options: RemoteApiClientOptions) {
  return new RemoteApiClient(options);
}

export class RemoteApiClient {
  #options: Required<RemoteApiClientOptions>;
  #axiosInstance: AxiosInstance;

  constructor(options: RemoteApiClientOptions) {
    this.#options = remoteApiClientOptionsSchema.parse(options);
    this.#axiosInstance = getRemoteApiClientAxios(this.#options);
  }

  reinitialize(options: RemoteApiClientOptions): void {
    this.#options = remoteApiClientOptionsSchema.parse(options);
    this.#axiosInstance = getRemoteApiClientAxios(
      this.#options,
      this.#axiosInstance,
    );
  }

  getServerUrl(type: RemoteServerType): string {
    const { region, shard } = this.options;
    return getServerUrl({ type, region, shard });
  }

  /**
   * @note url should be without the base url, like \`parties/v1/players/${api.puuid}\`
   * @example api.callEndpoint("glz", `parties/v1/players/${api.puuid}`, { method: "GET" })
   */
  callEndpoint<TConfig extends AxiosRequestConfig & CustomAxiosRequestConfig>(
    serverType: RemoteServerType,
    url: string,
    config?: TConfig,
  ) {
    return this.axiosInstance({
      ...config,
      baseURL: this.getServerUrl(serverType),
      url: url,
    });
  }

  get puuid(): string {
    return getPuuidFromAccessToken(this.options.accessToken);
  }

  /**
   * @returns RemoteApiClientOptions (structuredClone)
   */
  get options(): RemoteApiClientOptions {
    return structuredClone(this.#options);
  }

  /**
   * @returns AxiosInstance (Reference)
   */
  get axiosInstance(): AxiosInstance {
    return this.#axiosInstance;
  }
}

applyMixins(RemoteApiClient, [RemoteApiEndpoints]);
export interface RemoteApiClient extends RemoteApiEndpoints {}
