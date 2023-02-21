import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Agent } from "node:https";
import { objectEntries } from "ts-extras";
import {
  ValorantEndpoint,
  endpoints,
  platformSchema,
} from "valorant-api-types";
import z from "zod";
import {
  buildSuffixUrl,
  getFunctionName as getEndpointFunctionName,
  parseResponse,
} from "../helpers/endpoint.js";
import { getRemoteAuthHeaders } from "../helpers/headers.js";
import { RemoteServerType, getServerUrl } from "../helpers/servers.js";
import { RemoteApiClient } from "../types/remote-api-type.js";

export type ValorantEndpoints = Record<string, ValorantEndpoint>;
export type PlatformInfo = z.infer<typeof platformSchema>;

export type RemoteApiClientOptions = {
  shard: string;
  region: string;
  token: string;
  entitlement: string;
  version: string;
  userAgent?: string;
  platformInfo?: PlatformInfo;
};

const DEFAULT_PLATFORM_INFO: PlatformInfo = {
  platformType: "PC",
  platformOS: "Windows",
  platformOSVersion: "10.0.19044.1.256.64bit",
  platformChipset: "Unknown",
};

const DEFAULT_USER_AGENT = "ShooterGame/13 Windows/10.0.19043.1.256.64bit";

const DEAFULT_CLIENT_OPTIONS = {
  platformInfo: DEFAULT_PLATFORM_INFO,
  userAgent: DEFAULT_USER_AGENT,
} satisfies Partial<RemoteApiClientOptions>;

function getRemoteApiClientAxios(options: Required<RemoteApiClientOptions>) {
  const { token, entitlement, platformInfo, version, userAgent } = options;

  const authHeaders = getRemoteAuthHeaders({
    accessToken: token,
    entitlementsToken: entitlement,
    platformInfo,
    clientVersion: version,
    userAgent,
  });

  const axiosInstance = axios.create({
    headers: { ...authHeaders },
    httpsAgent: new Agent({
      rejectUnauthorized: false,
    }),
  });

  return axiosInstance;
}

function getEndpointFunction(
  endpoint: ValorantEndpoint,
  axiosInstance: AxiosInstance,
  options: RemoteApiClientOptions
) {
  const { shard, region } = options;

  const baseURL = getServerUrl({
    type: endpoint.type as RemoteServerType,
    shard,
    region,
  });

  return (config: AxiosRequestConfig = {}) => {
    const url = buildSuffixUrl(endpoint.suffix, config.data);

    return axiosInstance({
      url,
      baseURL,
      ...config,
      transformResponse: [
        data => JSON.parse(data),
        data => parseResponse(endpoint, data),
      ],
    });
  };
}

export function createRemoteApiClient(options: RemoteApiClientOptions) {
  const opts: Required<RemoteApiClientOptions> = {
    ...DEAFULT_CLIENT_OPTIONS,
    ...options,
  };

  const axios = getRemoteApiClientAxios(opts);

  const api = objectEntries(endpoints as ValorantEndpoints)
    .filter(([_, e]) => e.type !== "local" && e.type !== "other")
    .reduce((api, [_, e]) => {
      const functionName = getEndpointFunctionName(e);
      api[functionName] = getEndpointFunction(e, axios, options);
      return api;
    }, {} as Record<string, any>) as RemoteApiClient;

  return { axios, api };
}
