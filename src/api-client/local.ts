import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Agent } from "node:https";
import { objectEntries } from "ts-extras";
import { ValorantEndpoint, endpoints } from "valorant-api-types";
import {
  getFunctionName,
  parseRequestData,
  parseResponseData,
} from "~/helpers/endpoint.js";
import { getLocalAuthHeader } from "~/helpers/headers.js";
import { getServerUrl } from "~/helpers/servers.js";
import { ensureArray } from "~/utils/array.js";
import { LocalApiClient } from "./types.js";

type ValorantEndpoints = Record<string, ValorantEndpoint>;

export type LocalApiClientOptions = {
  port: string;
  username?: string;
  password: string;
};

function getLocalApiClientAxios(options: LocalApiClientOptions) {
  const { port, username = "riot", password } = options;

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
  axiosInstance: AxiosInstance
) {
  return (config: AxiosRequestConfig = {}) =>
    axiosInstance({
      url: endpoint.suffix,
      ...config,
      transformRequest: [
        data => parseRequestData(endpoint, data),
        ...ensureArray(axios.defaults.transformRequest),
      ],
      transformResponse: [
        ...ensureArray(axios.defaults.transformResponse),
        (data, _, status) => parseResponseData(endpoint, data, status!),
      ],
    });
}

export function createLocalApiClient(options: LocalApiClientOptions) {
  const axios = getLocalApiClientAxios(options);

  const api = objectEntries(endpoints as ValorantEndpoints)
    .filter(([_, e]) => e.type === "local")
    .reduce((api, [_, e]) => {
      const functionName = getFunctionName(e);
      api[functionName] = getEndpointFunction(e, axios);
      return api;
    }, {} as Record<string, any>) as LocalApiClient;

  return { axios, api };
}
