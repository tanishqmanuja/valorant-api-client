import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Agent } from "node:https";
import { objectEntries } from "ts-extras";
import { ValorantEndpoint, endpoints } from "valorant-api-types";
import z from "zod";

import {
  getFunctionName,
  parseRequestData,
  parseResponseData,
} from "~/helpers/endpoint.js";
import { getLocalAuthHeader } from "~/helpers/headers.js";
import { getServerUrl } from "~/helpers/servers.js";
import { ensureArray } from "~/utils/array.js";

import { CustomAxiosRequestConfig, LocalApi } from "../common/types.js";

type ValorantEndpoints = Record<string, ValorantEndpoint>;

export const localApiClientOptionsSchema = z.object({
  port: z.string(),
  username: z.string().optional(),
  password: z.string(),
  zodParseResponse: z.boolean().optional(),
});

export type LocalApiClientOptions = z.infer<typeof localApiClientOptionsSchema>;

const DEAFULT_CLIENT_OPTIONS = {
  username: "riot",
  zodParseResponse: true,
} satisfies Partial<LocalApiClientOptions>;

function getLocalApiClientAxios(options: Required<LocalApiClientOptions>) {
  const { port, username, password } = options;

  const baseURL = getServerUrl({ type: "local", port });
  const authHeader = getLocalAuthHeader(username, password);

  return axios.create({
    baseURL,
    headers: { ...authHeader },
    httpsAgent: new Agent({
      rejectUnauthorized: false,
    }),
  });
}

function getEndpointFunction(
  endpoint: ValorantEndpoint,
  axiosInstance: AxiosInstance,
  options: LocalApiClientOptions
) {
  const { zodParseResponse } = options;
  return (config: AxiosRequestConfig & CustomAxiosRequestConfig = {}) =>
    axiosInstance({
      url: endpoint.suffix,
      method: endpoint.method ?? "GET",
      ...config,
      transformRequest: [
        data => parseRequestData(endpoint, data),
        ...ensureArray(axios.defaults.transformRequest),
      ],
      transformResponse: [
        ...ensureArray(axios.defaults.transformResponse),
        (data, _, status) =>
          config.zodParseResponse ?? zodParseResponse
            ? parseResponseData(endpoint, data, status!)
            : data,
      ],
    });
}

export function createLocalApiClient(options: LocalApiClientOptions) {
  const opts: Required<LocalApiClientOptions> = {
    ...DEAFULT_CLIENT_OPTIONS,
    ...options,
  };

  const axios = getLocalApiClientAxios(opts);

  const api = objectEntries(endpoints as ValorantEndpoints)
    .filter(([_, e]) => e.type === "local")
    .reduce((api, [_, e]) => {
      const functionName = getFunctionName(e);
      api[functionName] = getEndpointFunction(e, axios, opts);
      return api;
    }, {} as Record<string, any>) as LocalApi;

  const helpers = {
    getAxiosInstance: () => axios,
    getOptions: () => structuredClone(opts),
  };

  return { api, ...helpers };
}

export type LocalApiClient = ReturnType<typeof createLocalApiClient>;
