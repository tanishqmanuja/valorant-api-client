import type { AxiosRequestConfig } from "axios";

export interface AxiosRequestConfigWithData<T> extends AxiosRequestConfig<T> {
  data: T;
}
