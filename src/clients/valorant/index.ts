import type { MaybePromise } from "@/utils/promise";

import { LocalApiClient } from "../local";
import { RemoteApiClient } from "../remote";
import { Initializers } from "./initializers";

export type ValorantApiClientOptions = {
  local: LocalApiClient;
  remote: RemoteApiClient;
};

export type ValorantApiClientInitializerOptions = {
  initializer:
    | (() => MaybePromise<ValorantApiClientOptions>)
    | keyof typeof Initializers;
};

export class ValorantApiClient {
  local: LocalApiClient;
  remote: RemoteApiClient;

  constructor(clients: ValorantApiClientOptions) {
    this.local = clients.local;
    this.remote = clients.remote;
  }

  get puuid() {
    return this.remote.puuid;
  }
}

export function createValorantApiClient(
  options: ValorantApiClientOptions,
): ValorantApiClient;
export function createValorantApiClient(
  options: ValorantApiClientInitializerOptions,
): Promise<ValorantApiClient>;
export function createValorantApiClient(
  options: ValorantApiClientOptions | ValorantApiClientInitializerOptions,
): MaybePromise<ValorantApiClient> {
  if ("initializer" in options) {
    const o =
      typeof options.initializer === "string"
        ? Initializers[options.initializer]()
        : options.initializer();
    if (o instanceof Promise) {
      return o.then(o => new ValorantApiClient(o));
    }
    return new ValorantApiClient(o);
  }

  return new ValorantApiClient(options);
}
