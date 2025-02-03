import { Agent } from "node:https";

import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import { CookieJar } from "tough-cookie";
import { z } from "zod";

import type { ValorantEndpoint } from "~/endpoints/schema";
import { HeadersBuilder } from "~/helpers/headers";
import { applyMixins } from "~/utils/classes";
import { applyToughCookieInterceptor } from "~/utils/lib/axios/tough-cookie-interceptor";

import { DEFAULT_CIPHERS, DEFAULT_SIGALGS } from "./constants";
import { AuthApiEndpoints } from "./endpoints";

export const authApiClientOptionsSchema = z.object({
  clientVersion: z.string(),
  rsoUserAgent: z.string(),
  ciphers: z.array(z.string()).default(DEFAULT_CIPHERS),
  sigalgs: z.array(z.string()).default(DEFAULT_SIGALGS),
});

export type AuthApiClientOptions = z.input<typeof authApiClientOptionsSchema>;

export function createAuthApiClient(options: AuthApiClientOptions) {
  return new AuthApiClient(options);
}

export class AuthApiClient {
  #axios: AxiosInstance;
  #cookieJar: CookieJar;
  #options: z.output<typeof authApiClientOptionsSchema>;

  constructor(options: AuthApiClientOptions) {
    this.#options = authApiClientOptionsSchema.parse(options);

    this.#axios = axios.create({
      headers: HeadersBuilder.create()
        .userAgent(this.#options.rsoUserAgent)
        .clientVersion(this.#options.clientVersion)
        .build(),
      httpsAgent: new Agent({
        ciphers: this.#options.ciphers.join(":"),
        sigalgs: this.#options.sigalgs.join(":"),
        honorCipherOrder: true,
        minVersion: "TLSv1.2",
      }),
      withCredentials: true,
    });

    this.#cookieJar = new CookieJar();
    applyToughCookieInterceptor(this.#axios, { jar: this.#cookieJar });
  }

  reinit(options: AuthApiClientOptions) {
    this.#options = authApiClientOptionsSchema.parse(options);

    Object.assign(
      this.#axios.defaults.headers,
      HeadersBuilder.create()
        .clientVersion(this.#options.clientVersion)
        .userAgent(this.#options.rsoUserAgent)
        .build(),
    );

    this.#axios.defaults.withCredentials = true;

    this.#axios.defaults.httpsAgent.options.ciphers =
      this.#options.ciphers.join(":");
    this.#axios.defaults.httpsAgent.options.sigalgs =
      this.#options.sigalgs.join(":");
    this.#axios.defaults.httpsAgent.options.honorCipherOrder = true;
    this.#axios.defaults.httpsAgent.options.minVersion = "TLSv1.2";
  }

  get axios() {
    return this.#axios;
  }

  get cookieJar() {
    return this.#cookieJar;
  }

  get options() {
    return structuredClone(this.#options);
  }

  ["~request"]<T extends ValorantEndpoint, TConfig extends AxiosRequestConfig>(
    endpoint: T,
    config: TConfig,
  ) {
    return this.axios({
      url: endpoint.url,
      method: endpoint.method,
      headers: endpoint.headers,
      ...config,
    });
  }
}

applyMixins(AuthApiClient, [AuthApiEndpoints]);
export interface AuthApiClient extends AuthApiEndpoints {}
