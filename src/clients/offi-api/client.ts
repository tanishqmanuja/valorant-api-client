import axios, { AxiosError } from "axios";
import { z } from "zod";

import { ensureArray } from "~/utils/array";

import { type Endpoints, endpoints } from "./endpoints";
import type { OffiApiResponse } from "./types";

export type OffiApiClientOptions = { zodParseResponse: boolean };

export function createOffiApiClient(options?: Partial<OffiApiClientOptions>) {
  const opts = { zodParseResponse: true, ...options };

  const client = axios.create({
    transformResponse: [
      (data: string) => JSON.parse(data),
      (data: OffiApiResponse) => {
        if (data.status === 200) {
          return data.data;
        } else {
          throw new AxiosError(data.error, "400");
        }
      },
    ],
  });

  const fetch = <
    T extends Endpoints,
    D = z.infer<(typeof endpoints)[T]["schema"]>
  >(
    endpoint: T,
    options?: Partial<OffiApiClientOptions>
  ) => {
    const { zodParseResponse } = { ...opts, ...options };
    const { url, schema } = endpoints[endpoint];

    return client.get<D>(url, {
      transformResponse: [
        ...ensureArray(client.defaults.transformResponse),
        zodParseResponse ? (data: unknown) => schema.parse(data) : data => data,
      ],
    });
  };

  return {
    getAxiosInstance: () => client,
    fetch,
  };
}

export type OffiApiClient = ReturnType<typeof createOffiApiClient>;
