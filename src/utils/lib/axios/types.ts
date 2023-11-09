import type { AxiosRequestConfig } from "axios";

export interface AxiosRequestConfigWithData<T = any>
  extends AxiosRequestConfig<T> {
  data: T;
}
