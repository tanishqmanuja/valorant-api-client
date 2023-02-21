import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Agent } from "node:https";
import { objectEntries } from "ts-extras";
import { ValorantEndpoint, endpoints } from "valorant-api-types";
import {
  getFunctionName as getEndpointFunctionName,
  parseResponse,
} from "../helpers/endpoint.js";
import { getLocalAuthHeader } from "../helpers/headers.js";
import { getServerUrl } from "../helpers/servers.js";
import { LocalApiClient } from "../types/local-api-type.js";

export type ValorantEndpoints = Record<string, ValorantEndpoint>;

export type LocalApiClientOptions = {
  port: string;
  username?: string;
  password: string;
};

function getLocalApiClientAxios(options: LocalApiClientOptions) {
  const { port, username = "riot", password } = options;

  const baseURL = getServerUrl({ type: "local", port });
  const authHeader = getLocalAuthHeader(username, password);

  const axiosInstance = axios.create({
    baseURL,
    headers: { ...authHeader },
    httpsAgent: new Agent({
      rejectUnauthorized: false,
    }),
  });

  return axiosInstance;
}

function getEndpointFunction(
  endpoint: ValorantEndpoint,
  axiosInstance: AxiosInstance
) {
  return (config: AxiosRequestConfig = {}) => {
    return axiosInstance({
      url: endpoint.suffix,
      ...config,
      transformResponse: [
        data => JSON.parse(data),
        data => parseResponse(endpoint, data),
      ],
    });
  };
}

export function createLocalApiClient(options: LocalApiClientOptions) {
  const axios = getLocalApiClientAxios(options);

  const api = objectEntries(endpoints as ValorantEndpoints)
    .filter(([_, e]) => e.type === "local")
    .reduce((api, [_, e]) => {
      const functionName = getEndpointFunctionName(e);
      api[functionName] = getEndpointFunction(e, axios);
      return api;
    }, {} as Record<string, any>) as LocalApiClient;

  return { axios, api };
}
