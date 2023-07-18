import { Agent } from "node:https";
import axios, { type AxiosInstance } from "axios";
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
    return axios.create({
      baseURL,
      headers: { ...authHeader },
      httpsAgent: new Agent({
        rejectUnauthorized: false,
      }),
    });
  }
}
