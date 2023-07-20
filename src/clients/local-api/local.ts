import { z } from "zod";
import type { AxiosInstance } from "axios";
import { applyMixins } from "~/utils/classes";
import { LocalApiEndpoints } from "./endpoints";
import { getLocalApiClientAxios } from "./helpers";

export const localApiClientOptionsSchema = z.object({
  port: z.string(),
  username: z.string().default("riot"),
  password: z.string(),
  parseResponseData: z.boolean().default(false),
});

export type LocalApiClientOptions = z.input<typeof localApiClientOptionsSchema>;

/**
 * @description functional wrapper for LocalApiClient
 */
export function createLocalApiClient(options: LocalApiClientOptions) {
  return new LocalApiClient(options);
}

export class LocalApiClient {
  #options: Required<LocalApiClientOptions>;
  #axiosInstance: AxiosInstance;

  constructor(options: LocalApiClientOptions) {
    this.#options = localApiClientOptionsSchema.parse(options);
    this.#axiosInstance = getLocalApiClientAxios(this.#options);
  }

  reinitialize(options: LocalApiClientOptions): void {
    this.#options = localApiClientOptionsSchema.parse(options);
    this.#axiosInstance = getLocalApiClientAxios(
      this.#options,
      this.#axiosInstance,
    );
  }

  /**
   * @returns LocalApiClientOptions (structuredClone)
   */
  get options(): LocalApiClientOptions {
    return structuredClone(this.#options);
  }

  /**
   * @returns AxiosInstance (Reference)
   */
  get axiosInstance(): AxiosInstance {
    return this.#axiosInstance;
  }
}

applyMixins(LocalApiClient, [LocalApiEndpoints]);
export interface LocalApiClient extends LocalApiEndpoints {}
