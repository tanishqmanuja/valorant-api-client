import type { MaybePromise } from "~/utils/promises";

import type { ValorantApiClient } from ".";
import type { AuthApiClient, AuthApiClientOptions } from "../auth";
import type { LocalApiClient, LocalApiClientOptions } from "../local";
import type { RemoteApiClient, RemoteApiClientOptions } from "../remote";

type ClientOptionsMap = {
  auth: {
    client: AuthApiClient;
    options: AuthApiClientOptions;
  };
  local: {
    client: LocalApiClient;
    options: LocalApiClientOptions;
  };
  remote: {
    client: RemoteApiClient;
    options: RemoteApiClientOptions;
  };
};

export type VapicProvider<ReturnType = unknown> = (
  ctx: ValorantApiClient,
) => MaybePromise<ReturnType>;

export type VapicOptions = {
  [client in keyof ClientOptionsMap]?: ClientOptionsMap[client]["options"];
};

export type VapicOptionsWithProviders = {
  [type in keyof ClientOptionsMap]?: ClientOptionsMap[type] extends {
    options: infer O;
  }
    ? VapicProvider<O> | O
    : ClientOptionsMap[type]["options"];
};
