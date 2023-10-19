import { Agent } from "node:https";
import { type AxiosInstance } from "axios";
import { createAxiosInstance } from "~/utils/axios";
import { getServerUrl, getLocalAuthHeader } from "~/helpers";
import type { LocalApiClientOptions } from ".";

export function getLocalApiClientAxios(
  options: Required<LocalApiClientOptions>,
  existingAxiosInstance?: AxiosInstance,
): AxiosInstance {
  const { port, username, password } = options;

  const baseURL = getServerUrl({ type: "local", port });
  const authHeader = getLocalAuthHeader(username, password);

  if (existingAxiosInstance) {
    existingAxiosInstance.defaults.baseURL = baseURL;
    Object.assign(existingAxiosInstance.defaults.headers, {
      ...existingAxiosInstance.defaults.headers,
      ...authHeader,
    });
    return existingAxiosInstance;
  } else {
    return createAxiosInstance({
      baseURL,
      headers: { ...authHeader },
      httpsAgent: new Agent({
        rejectUnauthorized: false,
      }),
    });
  }
}
