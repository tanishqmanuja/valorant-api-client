import { Agent } from "node:https";
import axios, { type AxiosInstance } from "axios";
import { AuthApiClientOptions } from ".";

export function getAuthApiClientAxios(
  options: Required<AuthApiClientOptions>,
  existingAxiosInstance?: AxiosInstance,
): AxiosInstance {
  const { rsoUserAgent, ciphers } = options;

  if (existingAxiosInstance) {
    Object.assign(existingAxiosInstance.defaults.headers, {
      ...existingAxiosInstance.defaults.headers,
      userAgent: rsoUserAgent,
    });
    existingAxiosInstance.defaults.httpsAgent.options.ciphers =
      ciphers.join(":");
    return existingAxiosInstance;
  } else {
    return axios.create({
      headers: {
        "User-Agent": rsoUserAgent,
      },
      httpsAgent: new Agent({
        ciphers: ciphers.join(":"),
        honorCipherOrder: true,
        minVersion: "TLSv1.2",
      }),
      withCredentials: true,
    });
  }
}
