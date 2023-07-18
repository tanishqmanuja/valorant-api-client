import { z } from "zod";
import axios, { type AxiosInstance } from "axios";
import { ensureArray } from "~/utils/array";
import { getOffiApiAxiosClient } from "./helpers";
import { type Endpoints, endpoints } from "./endpoints";

export const offiApiClientOptionsSchema = z.object({
  parseResponseData: z.boolean().default(true),
});

/**
 * @description functional wrapper for OffiApiClient
 */
export function createOffiApiClient(options: OffiApiClientOptions) {
  return new OffiApiClient(options);
}

export type OffiApiClientOptions = z.input<typeof offiApiClientOptionsSchema>;

export class OffiApiClient {
  #options: Required<OffiApiClientOptions>;
  #axiosInstance: AxiosInstance;

  constructor(options: OffiApiClientOptions) {
    this.#options = offiApiClientOptionsSchema.parse(options);
    this.#axiosInstance = getOffiApiAxiosClient();
  }

  fetch<T extends Endpoints, D = z.infer<(typeof endpoints)[T]["schema"]>>(
    endpoint: T,
    options?: Partial<OffiApiClientOptions>,
  ) {
    const { url, schema } = endpoints[endpoint];
    const shouldParseResponse =
      options?.parseResponseData ?? this.#options.parseResponseData;

    return this.#axiosInstance.get<D>(url, {
      ...(shouldParseResponse
        ? {
            transformResponse: [
              ...ensureArray(axios.defaults.transformResponse),
              (data: unknown) => schema.parse(data),
            ],
          }
        : {}),
    });
  }

  /**
   * @returns OffiApiClientOptions (structuredClone)
   */
  get options(): OffiApiClientOptions {
    return structuredClone(this.#options);
  }

  /**
   * @returns AxiosInstance (Reference)
   */
  get axiosInstance(): AxiosInstance {
    return this.#axiosInstance;
  }
}
