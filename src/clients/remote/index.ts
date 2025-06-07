import type { StandardSchemaV1 } from "@standard-schema/spec";
import axios, { type AxiosRequestConfig } from "axios";
import { Agent } from "undici";
import { z } from "zod/v4";

import {
  getRemoteServerUrl,
  isRemoteServerType,
  type RemoteServerType,
} from "@/helpers/servers";
import { zv } from "@/schemas/valorant";
import {
  createValidationInterceptor,
  type ValidationConfig,
} from "@/utils/axios/interceptors/validation";
import { encode } from "@/utils/base64";
import { buildUrl } from "@/utils/url";

import type {
  ConfigIfRequired,
  MethodConfig,
  StandardAxiosResponse,
  UrlConfig,
} from "../common/types";
import { DEFAULT_PLATFORM_INFO, DEFAULT_USER_AGENT } from "./constants";
import type { RemoteEndpoint } from "./endpoints";
import { getPuuidFromAccessToken } from "./helpers";
import type { FindEndpoint, FindUrl } from "./types";

export const remoteApiClientOptionsSchema = z.object({
  shard: z.string(),
  region: z.string(),
  accessToken: z.jwt(),
  entitlementsToken: z.jwt(),
  clientVersion: z.string(),
  userAgent: z.string().default(DEFAULT_USER_AGENT),
  platformInfo: zv.platform().default(DEFAULT_PLATFORM_INFO),
});

export type RemoteApiClientOptions = z.input<
  typeof remoteApiClientOptionsSchema
>;
export type RemoteApiClientInternalOptions = z.output<
  typeof remoteApiClientOptionsSchema
>;

export class RemoteApiClient {
  options: RemoteApiClientInternalOptions;

  axios = axios.create({
    timeout: 3 * 1000,
    adapter: "fetch",
    fetchOptions: {
      dispatcher: new Agent({ connect: { rejectUnauthorized: false } }),
    },
  });

  constructor(options: RemoteApiClientOptions) {
    this.options = remoteApiClientOptionsSchema.parse(options);
    createValidationInterceptor(this.axios);
  }

  get puuid() {
    return getPuuidFromAccessToken(this.options.accessToken);
  }

  private getServerUrl(type: RemoteServerType) {
    return getRemoteServerUrl({
      type,
      shard: this.options.shard,
      region: this.options.region,
    });
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.options.accessToken}`,
      "User-Agent": this.options.userAgent,
      "X-Riot-Entitlements-JWT": this.options.entitlementsToken,
      "X-Riot-ClientVersion": this.options.clientVersion,
      "X-Riot-ClientPlatform": encode(
        JSON.stringify(this.options.platformInfo),
      ),
    };
  }

  request<
    TResponse = any,
    TSchema extends StandardSchemaV1<
      TResponse,
      any
    > = StandardSchemaV1<TResponse>,
    const TType extends string = RemoteServerType,
    const TUrl extends string = FindUrl<TType>,
    TEndpoint extends RemoteEndpoint = FindEndpoint<TUrl, TType>,
  >(
    type: TType,
    url: TUrl,
    ...args: ConfigIfRequired<
      AxiosRequestConfig &
        ValidationConfig<TSchema> &
        UrlConfig<NoInfer<TUrl>> &
        MethodConfig<NoInfer<TEndpoint["methods"]>[number]>
    >
  ): Promise<StandardAxiosResponse<TSchema>> {
    const config = args[0];
    return this.axios({
      headers: this.getHeaders(),
      ...(isRemoteServerType(type) ? { baseURL: this.getServerUrl(type) } : {}),
      url: buildUrl(url, { puuid: this.puuid, ...config?.path }),
      ...config,
    });
  }
}

export function createRemoteApiClient(options: RemoteApiClientOptions) {
  return new RemoteApiClient(options);
}
