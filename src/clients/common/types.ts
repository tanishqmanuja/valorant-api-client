import { type IAxiosRetryConfig } from "axios-retry";

export type CustomAxiosRequestConfig = {
  parseResponseData?: boolean;
  customResponseParser?: (data: any) => any;
  "axios-retry"?: IAxiosRetryConfig;
};
