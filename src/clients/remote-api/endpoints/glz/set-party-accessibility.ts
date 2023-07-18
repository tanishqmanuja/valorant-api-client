/* THIS IS AN AUTOGENERATED FILE - DO NOT EDIT */

import { z } from "zod";
import axios from "axios";
import { setPartyAccessibilityEndpoint } from "valorant-api-types";
import { parseResponseDataFor, buildSuffix } from "~/helpers/endpoints";
import { ensureArray } from "~/utils/array";
import { AxiosRequestConfigWithData } from "~/utils/lib/axios";
import { type CustomAxiosRequestConfig } from "~/clients/common/types";
import { type RemoteApiClient } from "~/clients/remote-api";

type SetPartyAccessibilityBodyData = z.infer<
  typeof setPartyAccessibilityEndpoint.body
>;

type SetPartyAccessibilitySuffixData = { partyId: string };

export interface SetPartyAccessibilityRequestConfig
  extends AxiosRequestConfigWithData<
      SetPartyAccessibilityBodyData & SetPartyAccessibilitySuffixData
    >,
    CustomAxiosRequestConfig {}

export type SetPartyAccessibilityResponse = z.infer<
  (typeof setPartyAccessibilityEndpoint.responses)["200"]
>;

export class SetPartyAccessibilityRemoteApiEndpoint {
  /**
   * @description Set the accessibility of the party
   */
  postSetPartyAccessibility<T = SetPartyAccessibilityResponse>(
    this: RemoteApiClient,
    config: SetPartyAccessibilityRequestConfig,
  ) {
    const shouldParseResponse =
      config.parseResponseData ?? this.options.parseResponseData;

    return this.axiosInstance<T>({
      method: "POST",
      baseURL: this.getServerUrl(setPartyAccessibilityEndpoint.type),
      url: buildSuffix(setPartyAccessibilityEndpoint.suffix, config.data),
      ...config,
      transformRequest: [
        parseResponseDataFor(setPartyAccessibilityEndpoint),
        ...ensureArray(axios.defaults.transformRequest),
      ],
      ...(shouldParseResponse
        ? {
            transformResponse: [
              ...ensureArray(axios.defaults.transformResponse),
              parseResponseDataFor(
                setPartyAccessibilityEndpoint,
                config.customResponseParser,
              ),
            ],
          }
        : {}),
    });
  }
}