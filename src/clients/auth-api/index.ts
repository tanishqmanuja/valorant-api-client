import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Agent } from "node:https";
import { CookieJar } from "tough-cookie";
import { objectEntries } from "ts-extras";
import type { SetOptional } from "type-fest";
import { ValorantEndpoint, endpoints } from "valorant-api-types";
import z from "zod";

import { getFunctionName } from "~/helpers/endpoint.js";
import { createToughCookieInterceptor } from "~/utils/lib/axios/tough-cookie-interceptor.js";

import { AuthApi } from "../common/types.js";

type ValorantEndpoints = Record<string, ValorantEndpoint>;

export const authApiClientOptionsSchema = z.object({
  ciphers: z.array(z.string()).optional(),
  userAgent: z.string().optional(),
  cookieJar: z.instanceof(CookieJar).optional(),
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

function getAuthApiClientAxios(
  options: SetOptional<Required<AuthApiClientOptions>, "cookieJar">
) {
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
  const cookieJar = options.cookieJar ?? new CookieJar();

  const opts: Required<AuthApiClientOptions> = {
    ...DEAFULT_CLIENT_OPTIONS,
    ...options,
    cookieJar,
  };

  const axios = getAuthApiClientAxios(opts);

  createToughCookieInterceptor(axios, { jar: cookieJar });

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
    getCookieJar: () => cookieJar,
    get options() {
      return structuredClone(opts);
    },
  };

  return { api, ...helpers };
}

export type AuthApiClient = ReturnType<typeof createAuthApiClient>;
