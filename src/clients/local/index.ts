import type { StandardSchemaV1 } from "@standard-schema/spec";
import axios, { type AxiosRequestConfig } from "axios";
import { Agent } from "undici";
import { z } from "zod/v4";

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
import {
  LOCAL_ENDPOINTS,
  type LocalEndpoint,
  type LocalEndpointUrl,
} from "./endpoints";
import { type FindEndpoint } from "./types";

export const localApiClientOptionsSchema = z.object({
  port: z.coerce.number(),
  username: z.string().default("riot"),
  password: z.string(),
});

export type LocalApiClientOptions = z.input<typeof localApiClientOptionsSchema>;
export type LocalApiClientInternalOptions = z.output<
  typeof localApiClientOptionsSchema
>;

export class LocalApiClient {
  options: LocalApiClientInternalOptions;
  axios = axios.create({
    timeout: 2 * 1000,
    adapter: "fetch",
    fetchOptions: {
      dispatcher: new Agent({ connect: { rejectUnauthorized: false } }),
    },
  });

  constructor(options: LocalApiClientOptions) {
    this.options = localApiClientOptionsSchema.parse(options);
    createValidationInterceptor(this.axios);
  }

  private getServerUrl() {
    return `https://127.0.0.1:${this.options.port}/`;
  }

  private getHeaders() {
    return {
      Authorization: `Basic ${encode(
        `${this.options.username}:${this.options.password}`,
      )}`,
    };
  }

  request<
    TResponse = any,
    TSchema extends StandardSchemaV1<
      TResponse,
      any
    > = StandardSchemaV1<TResponse>,
    TUrl extends string = LocalEndpointUrl | (string & {}),
    TEndpoint extends LocalEndpoint = FindEndpoint<TUrl>,
  >(
    url: TUrl,
    ...args: ConfigIfRequired<
      AxiosRequestConfig &
        ValidationConfig<TSchema> &
        UrlConfig<NoInfer<TUrl>> &
        MethodConfig<NoInfer<TEndpoint["methods"]>[number]>
    >
  ): Promise<StandardAxiosResponse<TSchema>> {
    const endpoint = LOCAL_ENDPOINTS.find(e => e.url === url);
    if (!endpoint) {
      throw new Error(`Unknown endpoint: ${url}`);
    }

    const config = args[0];
    return this.axios({
      headers: this.getHeaders(),
      baseURL: this.getServerUrl(),
      url: buildUrl(endpoint.url, { ...config?.path }),
      ...config,
    });
  }
}

export function createLocalApiClient(options: LocalApiClientOptions) {
  return new LocalApiClient(options);
}
