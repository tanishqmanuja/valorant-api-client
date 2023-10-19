import { Agent } from "node:https";
import { type AxiosInstance } from "axios";
import { createAxiosInstance } from "~/utils/axios";
import { getRemoteAuthHeaders } from "~/helpers";
import type { RemoteApiClientOptions } from ".";

export function getRemoteApiClientAxios(
  options: Required<RemoteApiClientOptions>,
  existingAxiosInstance?: AxiosInstance,
): AxiosInstance {
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

  if (existingAxiosInstance) {
    Object.assign(existingAxiosInstance.defaults.headers, {
      ...existingAxiosInstance.defaults.headers,
      ...authHeaders,
    });
    return existingAxiosInstance;
  } else {
    return createAxiosInstance({
      headers: { ...authHeaders },
      httpsAgent: new Agent({
        rejectUnauthorized: false,
      }),
    });
  }
}
