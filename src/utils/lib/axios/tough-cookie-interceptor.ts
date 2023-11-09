import type { AxiosInstance } from "axios";
import { CookieJar, Store } from "tough-cookie";

import { ensureArray } from "~/utils/array";

export type ToughCookieOptions = {
  jar?: CookieJar;
  store?: Store;
};

export function createToughCookieInterceptor(
  axiosInstance: AxiosInstance,
  options: ToughCookieOptions,
): {
  readonly id: { request: number };
  eject: () => void;
} {
  const cookieJar = options.jar ?? new CookieJar(options.store);

  const requestInterceptorId = axiosInstance.interceptors.request.use(
    config => {
      if (config.url) {
        const previousCookie = config.headers["Cookie"] ?? "";
        config.headers = Object.assign(config.headers, {
          Cookie: previousCookie + cookieJar.getCookieStringSync(config.url),
        });
      }

      return config;
    },
  );

  const responseInterceptorId = axiosInstance.interceptors.response.use(
    response => {
      if (response.headers["set-cookie"]) {
        const cookies = ensureArray(response.headers["set-cookie"]);
        cookies.forEach(cookie => {
          if (response.config.url) {
            cookieJar.setCookieSync(cookie, response.config.url);
          }
        });
      }

      return response;
    },
  );

  return {
    get id() {
      return { request: requestInterceptorId, response: responseInterceptorId };
    },
    eject: () => {
      axiosInstance.interceptors.request.eject(requestInterceptorId);
      axiosInstance.interceptors.request.eject(responseInterceptorId);
    },
  };
}
