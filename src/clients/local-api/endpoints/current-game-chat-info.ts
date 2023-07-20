/* THIS IS AN AUTOGENERATED FILE - DO NOT EDIT */

import { z } from "zod";
import axios, { type AxiosResponse } from "axios";
import { type AxiosRequestConfig } from "axios";
import { currentGameChatInfoEndpoint } from "valorant-api-types";
import { parseResponseDataFor } from "~/helpers/endpoints";
import { ensureArray } from "~/utils/array";
import { type LocalApiClient } from "~/clients/local-api";
import { type CustomAxiosRequestConfig } from "~/clients/common/types";

export interface CurrentGameChatInfoRequestConfig
  extends AxiosRequestConfig,
    CustomAxiosRequestConfig {}

export type CurrentGameChatInfoResponse = z.input<
  (typeof currentGameChatInfoEndpoint.responses)["200"]
>;

export type CurrentGameChatInfoParsedResponse = z.output<
  (typeof currentGameChatInfoEndpoint.responses)["200"]
>;

export class CurrentGameChatInfoLocalApiEndpoint {
  /**
   * @description Get information about the current game chat
   */
  getCurrentGameChatInfo<T = CurrentGameChatInfoParsedResponse>(
    this: LocalApiClient,
    config: CurrentGameChatInfoRequestConfig & { parseResponseData: true },
  ): Promise<AxiosResponse<T>>;
  getCurrentGameChatInfo<T = CurrentGameChatInfoResponse>(
    this: LocalApiClient,
    config?: CurrentGameChatInfoRequestConfig,
  ): Promise<AxiosResponse<T>>;
  getCurrentGameChatInfo<T = CurrentGameChatInfoResponse>(
    this: LocalApiClient,
    config: CurrentGameChatInfoRequestConfig = {},
  ) {
    const shouldParseResponse =
      config.parseResponseData ?? this.options.parseResponseData;

    return this.axiosInstance<T>({
      method: "GET",
      url: currentGameChatInfoEndpoint.suffix,
      ...config,
      transformRequest: [
        parseResponseDataFor(currentGameChatInfoEndpoint),
        ...ensureArray(axios.defaults.transformRequest),
      ],
      ...(shouldParseResponse
        ? {
            transformResponse: [
              ...ensureArray(axios.defaults.transformResponse),
              parseResponseDataFor(
                currentGameChatInfoEndpoint,
                config.customResponseParser,
              ),
            ],
          }
        : {}),
    });
  }
}
