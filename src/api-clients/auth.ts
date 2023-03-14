import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Agent } from "node:https";
import { objectEntries } from "ts-extras";
import { ValorantEndpoint, endpoints } from "valorant-api-types";
import z from "zod";

import { getFunctionName } from "~/helpers/endpoint.js";

import { AuthApi } from "./types.js";

type ValorantEndpoints = Record<string, ValorantEndpoint>;

export const authApiClientOptionsSchema = z.object({
  ciphers: z.array(z.string()).optional(),
  userAgent: z.string().optional(),
});

export type AuthApiClientOptions = z.infer<typeof authApiClientOptionsSchema>;

const DEFAULT_CIPHERS = [
  "ECDHE-ECDSA-CHACHA20-POLY1305",
  "ECDHE-RSA-CHACHA20-POLY1305",
  "ECDHE-ECDSA-AES128-GCM-SHA256",
  "ECDHE-RSA-AES128-GCM-SHA256",
  "ECDHE-ECDSA-AES256-GCM-SHA384",
  "ECDHE-RSA-AES256-GCM-SHA384",
  "ECDHE-ECDSA-AES128-SHA",
  "ECDHE-RSA-AES128-SHA",
  "ECDHE-ECDSA-AES256-SHA",
  "ECDHE-RSA-AES256-SHA",
  "AES128-GCM-SHA256",
  "AES256-GCM-SHA384",
  "AES128-SHA",
  "AES256-SHA",
  "DES-CBC3-SHA",
  "TLS_CHACHA20_POLY1305_SHA256",
  "TLS_AES_128_GCM_SHA256",
  "TLS_AES_256_GCM_SHA384",
];

const DEFAULT_USER_AGENT =
  "RiotClient/62.0.1.4852117.4789131 rso-auth (Windows;10;;Professional, x64)";

const DEAFULT_CLIENT_OPTIONS = {
  userAgent: DEFAULT_USER_AGENT,
  ciphers: DEFAULT_CIPHERS,
} satisfies Partial<AuthApiClientOptions>;

function getAuthApiClientAxios(options: Required<AuthApiClientOptions>) {
  const { userAgent, ciphers } = options;

  return axios.create({
    headers: {
      "User-Agent": userAgent,
    },
    httpsAgent: new Agent({
      ciphers: ciphers.join(":"),
      honorCipherOrder: true,
      minVersion: "TLSv1.2",
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
      method: endpoint.method ?? "GET",
      headers: Object.fromEntries(endpoint.headers || []),
      ...config,
      withCredentials: true,
    });
}

export function createAuthApiClient(options: AuthApiClientOptions = {}) {
  const opts: Required<AuthApiClientOptions> = {
    ...DEAFULT_CLIENT_OPTIONS,
    ...options,
  };

  const axios = getAuthApiClientAxios(opts);

  const api = objectEntries(endpoints as ValorantEndpoints)
    .filter(
      ([_, e]) =>
        e.type === "other" && e.category === "Authentication Endpoints"
    )
    .reduce((api, [_, e]) => {
      const functionName = getFunctionName(e);
      api[functionName] = getEndpointFunction(e, axios);
      return api;
    }, {} as Record<string, any>) as AuthApi;

  const helpers = {
    getAxiosInstance: () => axios,
    getOptions: () => structuredClone(opts),
    getCookie: () => axios.defaults.headers["Cookie"],
    setCookie: (cookie: string) => (axios.defaults.headers["Cookie"] = cookie),
  };

  return { api, ...helpers };
}

export type AuthApiClient = ReturnType<typeof createAuthApiClient>;

export function parseAuthCookie(response: AxiosResponse) {
  const cookie = response.headers["set-cookie"]?.find(elem =>
    /^asid/.test(elem)
  );
  if (!cookie) {
    throw Error("No cookie found in response headers");
  }
  return cookie;
}

export function parseAccessToken<T extends { data: any }>(response: T) {
  const uri = response.data.response.parameters.uri;

  let url = new URL(uri);
  let params = new URLSearchParams(url.hash.substring(1));
  const token = params.get("access_token");
  if (!token) {
    throw Error("No token found in response");
  }
  return token;
}

export function parseEntitlementsToken(
  response: AxiosResponse<{ entitlements_token: string }>
) {
  return response.data.entitlements_token;
}
