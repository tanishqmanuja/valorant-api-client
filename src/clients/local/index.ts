import { Agent } from "node:https";

import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import { z } from "zod";

import type { ValorantEndpoint } from "~/endpoints/schema";
import { HeadersBuilder } from "~/helpers/headers";
import { getServerUrl } from "~/helpers/servers";
import { applyMixins } from "~/utils/classes";

import { LocalApiEndpoints } from "./endpoints";

export const localApiClientOptionsSchema = z.object({
  port: z.string(),
  username: z.string().default("riot"),
  password: z.string(),
});

export type LocalApiClientOptions = z.input<typeof localApiClientOptionsSchema>;

export function createLocalApiClient(options: LocalApiClientOptions) {
  return new LocalApiClient(options);
}

export class LocalApiClient {
  #axios: AxiosInstance;
  #options: z.output<typeof localApiClientOptionsSchema>;

  constructor(options: LocalApiClientOptions) {
    this.#options = localApiClientOptionsSchema.parse(options);

    this.#axios = axios.create({
      headers: HeadersBuilder.create()
        .localAuth(this.#options.username, this.#options.password)
        .build(),
      httpsAgent: new Agent({
        rejectUnauthorized: false,
      }),
    });
  }

  reinit(options: LocalApiClientOptions): void {
    this.#options = localApiClientOptionsSchema.parse(options);

    Object.assign(
      this.#axios.defaults.headers,
      HeadersBuilder.create()
        .localAuth(this.#options.username, this.#options.password)
        .build(),
    );
  }

  get axios() {
    return this.#axios;
  }

  get options() {
    return structuredClone(this.#options);
  }

  ["~request"]<
    T extends ValorantEndpoint & { type: "local" },
    TConfig extends AxiosRequestConfig,
  >(endpoint: T, config: TConfig) {
    return this.axios({
      baseURL: getServerUrl({ type: endpoint.type, port: this.#options.port }),
      url: endpoint.url,
      method: endpoint.method,
      headers: endpoint.headers,
      ...config,
    });
  }
}

applyMixins(LocalApiClient, [LocalApiEndpoints]);
export interface LocalApiClient extends LocalApiEndpoints {}
