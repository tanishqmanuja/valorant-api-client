import { AuthApiClient } from "../auth-api";
import { LocalApiClient } from "../local-api";
import { RemoteApiClient } from "../remote-api";
import type { VapicOptionsWithProviders, VapicOptions } from "./types";
import {
  isOptionsWithoutProvider,
  isProvider,
  CLIENT_RESOLUTION_ORDER,
} from "./helpers";

/**
 * @description functional wrapper for ValorantApiClient
 */
export async function createValorantApiClient<
  Options extends VapicOptionsWithProviders,
>(options: Options): Promise<ValorantApiClient> {
  if (isOptionsWithoutProvider(options)) {
    return new ValorantApiClient(options);
  }

  const vapic = new ValorantApiClient({});
  await vapic.reinitializeWithProviders(options);

  return vapic;
}

export class ValorantApiClient {
  #authApiClient: AuthApiClient;
  #localApiClient?: LocalApiClient;
  #remoteApiClient?: RemoteApiClient;

  constructor(options: VapicOptions) {
    this.#authApiClient = new AuthApiClient(options.auth);

    if (options.local) {
      this.#localApiClient = new LocalApiClient(options.local);
    }
    if (options.remote) {
      this.#remoteApiClient = new RemoteApiClient(options.remote);
    }
  }

  reinitialize(options: VapicOptions): void {
    if (options.auth) {
      this.#authApiClient.reinitialize(options.auth);
    }

    if (options.local) {
      if (this.#localApiClient) {
        this.#localApiClient.reinitialize(options.local);
      } else {
        this.#localApiClient = new LocalApiClient(options.local);
      }
    }

    if (options.remote) {
      if (this.#remoteApiClient) {
        this.#remoteApiClient.reinitialize(options.remote);
      } else {
        this.#remoteApiClient = new RemoteApiClient(options.remote);
      }
    }
  }

  async reinitializeWithProviders(
    options: VapicOptionsWithProviders,
  ): Promise<void> {
    for (const client of CLIENT_RESOLUTION_ORDER) {
      if (!options[client]) {
        continue;
      }

      const o = options[client];
      this.reinitialize({
        [client]: isProvider(o) ? await o(this) : o,
      });
    }
  }

  get auth(): AuthApiClient {
    return this.#authApiClient;
  }

  get local(): LocalApiClient {
    if (!this.#localApiClient) {
      throw new Error("LocalApiClient not initialized");
    }
    return this.#localApiClient;
  }

  get remote(): RemoteApiClient {
    if (!this.#remoteApiClient) {
      throw new Error("RemoteApiClient not initialized");
    }
    return this.#remoteApiClient;
  }
}
