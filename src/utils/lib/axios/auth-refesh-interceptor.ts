import { AxiosError, AxiosInstance } from "axios";
import authRefreshInterceptor, {
  AxiosAuthRefreshOptions,
} from "axios-auth-refresh";
import { MaybePromise } from "../typescript/promise";

export { AxiosAuthRefreshRequestConfig } from "axios-auth-refresh";

type AuthRefreshOptions = AxiosAuthRefreshOptions & {
  onRefresh: (error: AxiosError) => MaybePromise<any>;
};

export function createAuthRefreshInterceptor(
  axiosInstance: AxiosInstance,
  options: AuthRefreshOptions
) {
  const interceptorId = authRefreshInterceptor(
    axiosInstance,
    options.onRefresh,
    options
  );
  return {
    get id() {
      return interceptorId;
    },
    eject: () => {
      axiosInstance.interceptors.request.eject(interceptorId);
    },
  };
}
