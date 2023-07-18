/* THIS IS AN AUTOGENERATED FILE - DO NOT EDIT */

import { z } from "zod";
import axios from "axios";
import { sendChatEndpoint } from "valorant-api-types";
import { parseResponseDataFor } from "~/helpers/endpoints";
import { ensureArray } from "~/utils/array";
import { AxiosRequestConfigWithData } from "~/utils/lib/axios";
import { type LocalApiClient } from "~/clients/local-api";
import { type CustomAxiosRequestConfig } from "~/clients/common/types";

type SendChatBodyData = z.infer<typeof sendChatEndpoint.body>;

export interface SendChatRequestConfig
  extends AxiosRequestConfigWithData<SendChatBodyData>,
    CustomAxiosRequestConfig {}

export type SendChatResponse = z.infer<
  (typeof sendChatEndpoint.responses)["200"]
>;

export class SendChatLocalApiEndpoint {
  /**
   * @description Send a message to the specified group
   */
  postSendChat<T = SendChatResponse>(
    this: LocalApiClient,
    config: SendChatRequestConfig,
  ) {
    const shouldParseResponse =
      config.parseResponseData ?? this.options.parseResponseData;

    return this.axiosInstance<T>({
      method: "POST",
      url: sendChatEndpoint.suffix,
      ...config,
      transformRequest: [
        parseResponseDataFor(sendChatEndpoint),
        ...ensureArray(axios.defaults.transformRequest),
      ],
      ...(shouldParseResponse
        ? {
            transformResponse: [
              ...ensureArray(axios.defaults.transformResponse),
              parseResponseDataFor(
                sendChatEndpoint,
                config.customResponseParser,
              ),
            ],
          }
        : {}),
    });
  }
}