export type CustomAxiosRequestConfig = {
  parseResponseData?: boolean;
  customResponseParser?: (data: any) => any;
};
