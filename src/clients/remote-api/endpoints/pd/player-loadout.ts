/* THIS IS AN AUTOGENERATED FILE - DO NOT EDIT */

import { z } from "zod";
import axios, { type AxiosResponse } from "axios";
import { playerLoadoutEndpoint } from "valorant-api-types";
import { parseResponseDataFor, buildSuffix } from "~/helpers/endpoints";
import { ensureArray } from "~/utils/array";
import { AxiosRequestConfigWithData } from "~/utils/lib/axios";
import { type CustomAxiosRequestConfig } from "~/clients/common/types";
import { type RemoteApiClient } from "~/clients/remote-api";

type PlayerLoadoutSuffixData = { puuid: string };

export interface PlayerLoadoutRequestConfig
  extends AxiosRequestConfigWithData<PlayerLoadoutSuffixData>,
    CustomAxiosRequestConfig {}

export type PlayerLoadoutResponse = z.input<
  (typeof playerLoadoutEndpoint.responses)["200"]
>;

export type PlayerLoadoutParsedResponse = z.output<
  (typeof playerLoadoutEndpoint.responses)["200"]
>;

export class PlayerLoadoutRemoteApiEndpoint {
  /**
   * @description Get the player's current loadout. Only works for your own PUUID.
   */
  getPlayerLoadout<T = PlayerLoadoutParsedResponse>(
    this: RemoteApiClient,
    config: PlayerLoadoutRequestConfig & { parseResponseData: true },
  ): Promise<AxiosResponse<T>>;
  getPlayerLoadout<T = PlayerLoadoutResponse>(
    this: RemoteApiClient,
    config?: PlayerLoadoutRequestConfig,
  ): Promise<AxiosResponse<T>>;
  getPlayerLoadout<T = PlayerLoadoutResponse>(
    this: RemoteApiClient,
    config: PlayerLoadoutRequestConfig,
  ) {
    const shouldParseResponse =
      config.parseResponseData ?? this.options.parseResponseData;

    return this.axiosInstance<T>({
      method: "GET",
      baseURL: this.getServerUrl(playerLoadoutEndpoint.type),
      url: buildSuffix(playerLoadoutEndpoint.suffix, config.data),
      ...config,
      transformRequest: [
        parseResponseDataFor(playerLoadoutEndpoint),
        ...ensureArray(axios.defaults.transformRequest),
      ],
      ...(shouldParseResponse
        ? {
            transformResponse: [
              ...ensureArray(axios.defaults.transformResponse),
              parseResponseDataFor(
                playerLoadoutEndpoint,
                config.customResponseParser,
              ),
            ],
          }
        : {}),
    });
  }
}
