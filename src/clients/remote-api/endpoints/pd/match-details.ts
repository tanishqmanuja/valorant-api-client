/* THIS IS AN AUTOGENERATED FILE - DO NOT EDIT */

import { z } from "zod";
import axios, { type AxiosResponse } from "axios";
import { matchDetailsEndpoint } from "valorant-api-types";
import { parseResponseDataFor, buildSuffix } from "~/helpers/endpoints";
import { ensureArray } from "~/utils/array";
import { AxiosRequestConfigWithData } from "~/utils/lib/axios";
import { type CustomAxiosRequestConfig } from "~/clients/common/types";
import { type RemoteApiClient } from "~/clients/remote-api";

type MatchDetailsSuffixData = { matchId: string };

export interface MatchDetailsRequestConfig
  extends AxiosRequestConfigWithData<MatchDetailsSuffixData>,
    CustomAxiosRequestConfig {}

export type MatchDetailsResponse = z.input<
  (typeof matchDetailsEndpoint.responses)["200"]
>;

export type MatchDetailsParsedResponse = z.output<
  (typeof matchDetailsEndpoint.responses)["200"]
>;

export class MatchDetailsRemoteApiEndpoint {
  /**
   * @description Get the details of a match after it ends
   */
  getMatchDetails<T = MatchDetailsParsedResponse>(
    this: RemoteApiClient,
    config: MatchDetailsRequestConfig & { parseResponseData: true },
  ): Promise<AxiosResponse<T>>;
  getMatchDetails<T = MatchDetailsResponse>(
    this: RemoteApiClient,
    config?: MatchDetailsRequestConfig,
  ): Promise<AxiosResponse<T>>;
  getMatchDetails<T = MatchDetailsResponse>(
    this: RemoteApiClient,
    config: MatchDetailsRequestConfig,
  ) {
    const shouldParseResponse =
      config.parseResponseData ?? this.options.parseResponseData;

    return this.axiosInstance<T>({
      method: "GET",
      baseURL: this.getServerUrl(matchDetailsEndpoint.type),
      url: buildSuffix(matchDetailsEndpoint.suffix, config.data),
      ...config,
      transformRequest: [
        parseResponseDataFor(matchDetailsEndpoint),
        ...ensureArray(axios.defaults.transformRequest),
      ],
      ...(shouldParseResponse
        ? {
            transformResponse: [
              ...ensureArray(axios.defaults.transformResponse),
              parseResponseDataFor(
                matchDetailsEndpoint,
                config.customResponseParser,
              ),
            ],
          }
        : {}),
    });
  }
}
