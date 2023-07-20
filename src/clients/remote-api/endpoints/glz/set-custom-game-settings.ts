/* THIS IS AN AUTOGENERATED FILE - DO NOT EDIT */

import { z } from "zod";
import axios, { type AxiosResponse } from "axios";
import { setCustomGameSettingsEndpoint } from "valorant-api-types";
import { parseResponseDataFor, buildSuffix } from "~/helpers/endpoints";
import { ensureArray } from "~/utils/array";
import { AxiosRequestConfigWithData } from "~/utils/lib/axios";
import { type CustomAxiosRequestConfig } from "~/clients/common/types";
import { type RemoteApiClient } from "~/clients/remote-api";

type SetCustomGameSettingsBodyData = z.infer<
  typeof setCustomGameSettingsEndpoint.body
>;

type SetCustomGameSettingsSuffixData = { partyId: string };

export interface SetCustomGameSettingsRequestConfig
  extends AxiosRequestConfigWithData<
      SetCustomGameSettingsBodyData & SetCustomGameSettingsSuffixData
    >,
    CustomAxiosRequestConfig {}

export type SetCustomGameSettingsResponse = z.input<
  (typeof setCustomGameSettingsEndpoint.responses)["200"]
>;

export type SetCustomGameSettingsParsedResponse = z.output<
  (typeof setCustomGameSettingsEndpoint.responses)["200"]
>;

export class SetCustomGameSettingsRemoteApiEndpoint {
  /**
   * @description Changes the settings for a custom game
   */
  postSetCustomGameSettings<T = SetCustomGameSettingsParsedResponse>(
    this: RemoteApiClient,
    config: SetCustomGameSettingsRequestConfig & { parseResponseData: true },
  ): Promise<AxiosResponse<T>>;
  postSetCustomGameSettings<T = SetCustomGameSettingsResponse>(
    this: RemoteApiClient,
    config: SetCustomGameSettingsRequestConfig,
  ): Promise<AxiosResponse<T>>;
  postSetCustomGameSettings<T = SetCustomGameSettingsResponse>(
    this: RemoteApiClient,
    config: SetCustomGameSettingsRequestConfig,
  ) {
    const shouldParseResponse =
      config.parseResponseData ?? this.options.parseResponseData;

    return this.axiosInstance<T>({
      method: "POST",
      baseURL: this.getServerUrl(setCustomGameSettingsEndpoint.type),
      url: buildSuffix(setCustomGameSettingsEndpoint.suffix, config.data),
      ...config,
      transformRequest: [
        parseResponseDataFor(setCustomGameSettingsEndpoint),
        ...ensureArray(axios.defaults.transformRequest),
      ],
      ...(shouldParseResponse
        ? {
            transformResponse: [
              ...ensureArray(axios.defaults.transformResponse),
              parseResponseDataFor(
                setCustomGameSettingsEndpoint,
                config.customResponseParser,
              ),
            ],
          }
        : {}),
    });
  }
}
