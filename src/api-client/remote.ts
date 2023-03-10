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
  getFunctionName,
  parseRequestData,
  parseResponseData,
} from "~/helpers/endpoint.js";
import {
  getAccessTokenHeader,
  getEntitlementsJWTHeader,
  getRemoteAuthHeaders,
} from "~/helpers/headers.js";
import { getPuuidFromAccessToken } from "~/helpers/helpers.js";
import { RemoteServerType, getServerUrl } from "~/helpers/servers.js";
import { ensureArray } from "~/utils/array.js";

import { CustomAxiosRequestConfig, RemoteApi } from "./types.js";

type ValorantEndpoints = Record<string, ValorantEndpoint>;
type PlatformInfo = z.infer<typeof platformSchema>;

export const remoteApiClientOptionsSchema = z.object({
  shard: z.string(),
  region: z.string(),
  accessToken: z.string(),
  entitlementsToken: z.string(),
  clientVersion: z.string(),
  userAgent: z.string().optional(),
  platformInfo: platformSchema.optional(),
  zodParseResponse: z.boolean().optional(),
});

export type RemoteApiClientOptions = z.infer<
  typeof remoteApiClientOptionsSchema
>;

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
  zodParseResponse: true,
} satisfies Partial<RemoteApiClientOptions>;

function getRemoteApiClientAxios(options: Required<RemoteApiClientOptions>) {
  const {
    accessToken,
    entitlementsToken,
    platformInfo,
    clientVersion,
    userAgent,
  } = options;

  const authHeaders = getRemoteAuthHeaders({
    accessToken,
    entitlementsToken,
    platformInfo,
    clientVersion,
    userAgent,
  });

  return axios.create({
    headers: { ...authHeaders },
    httpsAgent: new Agent({
      rejectUnauthorized: false,
    }),
  });
}

function getEndpointFunction(
  endpoint: ValorantEndpoint,
  axiosInstance: AxiosInstance,
  options: RemoteApiClientOptions
) {
  const { shard, region, zodParseResponse } = options;

  const baseURL = getServerUrl({
    type: endpoint.type as RemoteServerType,
    shard,
    region,
  });

  return (config: AxiosRequestConfig & CustomAxiosRequestConfig = {}) => {
    const url = buildSuffixUrl(endpoint.suffix, config.data);

    return axiosInstance({
      url,
      baseURL,
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
      const functionName = getFunctionName(e);
      api[functionName] = getEndpointFunction(e, axios, opts);
      return api;
    }, {} as Record<string, any>) as RemoteApi;

  type Tokens = Pick<
    RemoteApiClientOptions,
    "accessToken" | "entitlementsToken"
  >;
  const getTokens = (): Tokens => ({
    accessToken: axios.defaults.headers["Authorization"] as string,
    entitlementsToken: axios.defaults.headers[
      "X-Riot-Entitlements-JWT"
    ] as string,
  });

  const helpers = {
    getAxiosInstance: () => axios,
    getTokens,
    setTokens: ({ accessToken, entitlementsToken }: Tokens) => {
      axios.defaults.headers = Object.assign(axios.defaults.headers, {
        ...getAccessTokenHeader(accessToken),
        ...getEntitlementsJWTHeader(entitlementsToken),
      });
    },
    getOptions: () => structuredClone({ ...opts, ...getTokens() }),
    getPuuid: () => getPuuidFromAccessToken(getTokens().accessToken),
  };

  return { api, ...helpers };
}

export type RemoteApiClient = ReturnType<typeof createRemoteApiClient>;
