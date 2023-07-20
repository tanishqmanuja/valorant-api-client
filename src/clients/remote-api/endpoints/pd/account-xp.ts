/* THIS IS AN AUTOGENERATED FILE - DO NOT EDIT */

import { z } from "zod";
import axios, { type AxiosResponse } from "axios";
import { accountXPEndpoint } from "valorant-api-types";
import { parseResponseDataFor, buildSuffix } from "~/helpers/endpoints";
import { ensureArray } from "~/utils/array";
import { AxiosRequestConfigWithData } from "~/utils/lib/axios";
import { type CustomAxiosRequestConfig } from "~/clients/common/types";
import { type RemoteApiClient } from "~/clients/remote-api";

type AccountXpSuffixData = { puuid: string };

export interface AccountXpRequestConfig
  extends AxiosRequestConfigWithData<AccountXpSuffixData>,
    CustomAxiosRequestConfig {}

export type AccountXpResponse = z.input<
  (typeof accountXPEndpoint.responses)["200"]
>;

export type AccountXpParsedResponse = z.output<
  (typeof accountXPEndpoint.responses)["200"]
>;

export class AccountXpRemoteApiEndpoint {
  /**
   * @description Get the account level, XP, and XP history for the given player
   */
  getAccountXp<T = AccountXpParsedResponse>(
    this: RemoteApiClient,
    config: AccountXpRequestConfig & { parseResponseData: true },
  ): Promise<AxiosResponse<T>>;
  getAccountXp<T = AccountXpResponse>(
    this: RemoteApiClient,
    config?: AccountXpRequestConfig,
  ): Promise<AxiosResponse<T>>;
  getAccountXp<T = AccountXpResponse>(
    this: RemoteApiClient,
    config: AccountXpRequestConfig,
  ) {
    const shouldParseResponse =
      config.parseResponseData ?? this.options.parseResponseData;

    return this.axiosInstance<T>({
      method: "GET",
      baseURL: this.getServerUrl(accountXPEndpoint.type),
      url: buildSuffix(accountXPEndpoint.suffix, config.data),
      ...config,
      transformRequest: [
        parseResponseDataFor(accountXPEndpoint),
        ...ensureArray(axios.defaults.transformRequest),
      ],
      ...(shouldParseResponse
        ? {
            transformResponse: [
              ...ensureArray(axios.defaults.transformResponse),
              parseResponseDataFor(
                accountXPEndpoint,
                config.customResponseParser,
              ),
            ],
          }
        : {}),
    });
  }
}
