import { Agent } from "node:https";
import axios, { type AxiosInstance } from "axios";
import type { AuthApiClientOptions } from "./auth";
import { getClientVersionHeader, getUserAgentHeader } from "~/helpers";

export function getAuthApiClientAxios(
  options: Required<AuthApiClientOptions>,
  existingAxiosInstance?: AxiosInstance,
): AxiosInstance {
  const { userAgent, ciphers, clientVersion, sigalgs } = options;

  if (existingAxiosInstance) {
    Object.assign(existingAxiosInstance.defaults.headers, {
      ...existingAxiosInstance.defaults.headers,
      ...getUserAgentHeader(userAgent),
      ...getClientVersionHeader(clientVersion),
    });
    existingAxiosInstance.defaults.httpsAgent.options.ciphers =
      ciphers.join(":");
    existingAxiosInstance.defaults.httpsAgent.options.sigalgs =
      sigalgs.join(":");
    return existingAxiosInstance;
  } else {
    return axios.create({
      headers: {
        ...getUserAgentHeader(userAgent),
        ...getClientVersionHeader(clientVersion),
      },
      httpsAgent: new Agent({
        ciphers: ciphers.join(":"),
        sigalgs: sigalgs.join(":"),
        honorCipherOrder: true,
        minVersion: "TLSv1.2",
      }),
      withCredentials: true,
    });
  }
}
