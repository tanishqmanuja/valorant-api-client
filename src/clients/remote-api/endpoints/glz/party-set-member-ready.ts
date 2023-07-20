/* THIS IS AN AUTOGENERATED FILE - DO NOT EDIT */

import { z } from "zod";
import axios, { type AxiosResponse } from "axios";
import { partySetMemberReadyEndpoint } from "valorant-api-types";
import { parseResponseDataFor, buildSuffix } from "~/helpers/endpoints";
import { ensureArray } from "~/utils/array";
import { AxiosRequestConfigWithData } from "~/utils/lib/axios";
import { type CustomAxiosRequestConfig } from "~/clients/common/types";
import { type RemoteApiClient } from "~/clients/remote-api";

type PartySetMemberReadyBodyData = z.infer<
  typeof partySetMemberReadyEndpoint.body
>;

type PartySetMemberReadySuffixData = { partyId: string; puuid: string };

export interface PartySetMemberReadyRequestConfig
  extends AxiosRequestConfigWithData<
      PartySetMemberReadyBodyData & PartySetMemberReadySuffixData
    >,
    CustomAxiosRequestConfig {}

export type PartySetMemberReadyResponse = z.input<
  (typeof partySetMemberReadyEndpoint.responses)["200"]
>;

export type PartySetMemberReadyParsedResponse = z.output<
  (typeof partySetMemberReadyEndpoint.responses)["200"]
>;

export class PartySetMemberReadyRemoteApiEndpoint {
  /**
   * @description Set the ready status of a player in the current party
   */
  postPartySetMemberReady<T = PartySetMemberReadyParsedResponse>(
    this: RemoteApiClient,
    config: PartySetMemberReadyRequestConfig & { parseResponseData: true },
  ): Promise<AxiosResponse<T>>;
  postPartySetMemberReady<T = PartySetMemberReadyResponse>(
    this: RemoteApiClient,
    config: PartySetMemberReadyRequestConfig,
  ): Promise<AxiosResponse<T>>;
  postPartySetMemberReady<T = PartySetMemberReadyResponse>(
    this: RemoteApiClient,
    config: PartySetMemberReadyRequestConfig,
  ) {
    const shouldParseResponse =
      config.parseResponseData ?? this.options.parseResponseData;

    return this.axiosInstance<T>({
      method: "POST",
      baseURL: this.getServerUrl(partySetMemberReadyEndpoint.type),
      url: buildSuffix(partySetMemberReadyEndpoint.suffix, config.data),
      ...config,
      transformRequest: [
        parseResponseDataFor(partySetMemberReadyEndpoint),
        ...ensureArray(axios.defaults.transformRequest),
      ],
      ...(shouldParseResponse
        ? {
            transformResponse: [
              ...ensureArray(axios.defaults.transformResponse),
              parseResponseDataFor(
                partySetMemberReadyEndpoint,
                config.customResponseParser,
              ),
            ],
          }
        : {}),
    });
  }
}
