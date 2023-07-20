/* THIS IS AN AUTOGENERATED FILE - DO NOT EDIT */

import { z } from "zod";
import axios, { type AxiosResponse } from "axios";
import { lockCharacterEndpoint } from "valorant-api-types";
import { parseResponseDataFor, buildSuffix } from "~/helpers/endpoints";
import { ensureArray } from "~/utils/array";
import { AxiosRequestConfigWithData } from "~/utils/lib/axios";
import { type CustomAxiosRequestConfig } from "~/clients/common/types";
import { type RemoteApiClient } from "~/clients/remote-api";

type LockCharacterSuffixData = { preGameMatchId: string; agentId: string };

export interface LockCharacterRequestConfig
  extends AxiosRequestConfigWithData<LockCharacterSuffixData>,
    CustomAxiosRequestConfig {}

export type LockCharacterResponse = z.input<
  (typeof lockCharacterEndpoint.responses)["200"]
>;

export type LockCharacterParsedResponse = z.output<
  (typeof lockCharacterEndpoint.responses)["200"]
>;

export class LockCharacterRemoteApiEndpoint {
  /**
   * @description Lock in an agent
   * **DO NOT USE THIS FOR INSTALOCKING**
   * Riot doesn't like this. You may get banned or get the API restricted for the rest of us.
   */
  postLockCharacter<T = LockCharacterParsedResponse>(
    this: RemoteApiClient,
    config: LockCharacterRequestConfig & { parseResponseData: true },
  ): Promise<AxiosResponse<T>>;
  postLockCharacter<T = LockCharacterResponse>(
    this: RemoteApiClient,
    config?: LockCharacterRequestConfig,
  ): Promise<AxiosResponse<T>>;
  postLockCharacter<T = LockCharacterResponse>(
    this: RemoteApiClient,
    config: LockCharacterRequestConfig,
  ) {
    const shouldParseResponse =
      config.parseResponseData ?? this.options.parseResponseData;

    return this.axiosInstance<T>({
      method: "POST",
      baseURL: this.getServerUrl(lockCharacterEndpoint.type),
      url: buildSuffix(lockCharacterEndpoint.suffix, config.data),
      ...config,
      transformRequest: [
        parseResponseDataFor(lockCharacterEndpoint),
        ...ensureArray(axios.defaults.transformRequest),
      ],
      ...(shouldParseResponse
        ? {
            transformResponse: [
              ...ensureArray(axios.defaults.transformResponse),
              parseResponseDataFor(
                lockCharacterEndpoint,
                config.customResponseParser,
              ),
            ],
          }
        : {}),
    });
  }
}
