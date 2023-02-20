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
  getArgsMap,
  getArgsZodSchema,
  getFunctionName as getEndpointFunctionName,
  replaceSuffixArgs,
} from "../helpers/endpoint.js";
import { getRemoteAuthHeaders } from "../helpers/headers.js";
import { RemoteServerType, getServerUrl } from "../helpers/servers.js";
import { RemoteApiClient } from "../types/remote-api-type.js";
import { createRateLimitInterceptor } from "../utils/lib/axios/rate-limit-interceptor.js";

export type ValorantEndpoints = Record<string, ValorantEndpoint>;
export type PlatformInfo = z.infer<typeof platformSchema>;

export type RemoteApiClientOptions = {
  shard: string;
  region?: string;
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

const DEAFULT_CLIENT_OPTIONS: Partial<RemoteApiClientOptions> = {
  platformInfo: DEFAULT_PLATFORM_INFO,
  userAgent: DEFAULT_USER_AGENT,
};

function getRemoteApiClientAxios(options: RemoteApiClientOptions) {
  const { token, entitlement, platformInfo, version, userAgent } = options;

  const authHeader = getRemoteAuthHeaders(
    token,
    entitlement,
    platformInfo!,
    version,
    userAgent!
  );

  const axiosInstance = axios.create({
    headers: { ...authHeader },
    httpsAgent: new Agent({
      rejectUnauthorized: false,
    }),
  });

  createRateLimitInterceptor(axiosInstance, { count: 6, interval: 1000 });
  return axiosInstance;
}

function getEndpointFunction(
  endpoint: ValorantEndpoint,
  axios: AxiosInstance,
  options: RemoteApiClientOptions
) {
  const { shard, region } = options;

  const baseURL = getServerUrl({
    type: endpoint.type as RemoteServerType,
    shard,
    region,
  });

  return (config: AxiosRequestConfig = {}) => {
    const argsMap = getArgsMap(endpoint.suffix);
    const argsSchema = getArgsZodSchema(argsMap);
    const args = argsSchema.parse(config.data);
    const url = replaceSuffixArgs(endpoint.suffix, args, argsMap);

    return axios({
      url,
      baseURL,
      ...config,
      transformResponse: [
        data => endpoint?.responses?.["200"].parse(JSON.parse(data)),
      ],
    });
  };
}

export function createRemoteApiClient(options: RemoteApiClientOptions) {
  const opts = { ...DEAFULT_CLIENT_OPTIONS, ...options };

  const axios = getRemoteApiClientAxios(opts);

  const api = objectEntries(endpoints as ValorantEndpoints)
    .filter(([_, e]) => e.type !== "local" && e.type !== "other")
    .reduce((api, [_, e]) => {
      const functionName = getEndpointFunctionName(e);
      api[functionName] = getEndpointFunction(e, axios, options);
      return api;
    }, {} as Record<string, any>);

  return api as RemoteApiClient;
}
