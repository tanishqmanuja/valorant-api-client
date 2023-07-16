import { z } from "zod";
import { CookieJar } from "tough-cookie";
import type { AxiosInstance } from "axios";

import { applyMixins } from "~/utils/classes";
import { createToughCookieInterceptor } from "~/utils/lib/axios";

import { AuthApiEndpoints } from "./endpoints";
import { getAuthApiClientAxios } from "./helpers";
import { DEFAULT_CIPHERS, DEFAULT_RSO_USER_AGENT } from "~/helpers";

export const authApiClientOptionsSchema = z.object({
  ciphers: z.array(z.string()).default(DEFAULT_CIPHERS),
  rsoUserAgent: z.string().default(DEFAULT_RSO_USER_AGENT),
  cookieJar: z.instanceof(CookieJar).default(new CookieJar()),
});

export type AuthApiClientOptions = z.input<typeof authApiClientOptionsSchema>;

/**
 * @description functional wrapper for AuthApiClient
 */
export function createAuthApiClient(options: AuthApiClientOptions) {
  return new AuthApiClient(options);
}

export class AuthApiClient {
  #options: Required<AuthApiClientOptions>;
  #axiosInstance: AxiosInstance;

  constructor(options: AuthApiClientOptions = {}) {
    this.#options = authApiClientOptionsSchema.parse(options);
    this.#axiosInstance = getAuthApiClientAxios(this.#options);

    createToughCookieInterceptor(this.#axiosInstance, {
      jar: this.#options.cookieJar,
    });
  }

  reinitialize(options: AuthApiClientOptions = {}): void {
    this.#options = authApiClientOptionsSchema.parse(options);
    this.#axiosInstance = getAuthApiClientAxios(
      this.#options,
      this.#axiosInstance,
    );
  }

  /**
   * @returns CookieJar (Reference)
   */
  get cookieJar(): CookieJar {
    return this.#options.cookieJar;
  }

  /**
   * @returns AuthApiClientOptions (structuredClone, excluding cookieJar)
   */
  get options(): Required<Omit<AuthApiClientOptions, "cookieJar">> {
    return structuredClone({ ...this.#options, cookieJar: undefined });
  }

  /**
   * @returns AxiosInstance (Reference)
   */
  get axiosInstance(): AxiosInstance {
    return this.#axiosInstance;
  }
}

applyMixins(AuthApiClient, [AuthApiEndpoints]);
export interface AuthApiClient extends AuthApiEndpoints {}
