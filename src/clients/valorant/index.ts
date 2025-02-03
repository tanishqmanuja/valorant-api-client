import { AuthApiClient } from "../auth";
import { LocalApiClient } from "../local";
import { RemoteApiClient } from "../remote";
import { isOptionsWithoutProvider, isProvider } from "./helpers";
import type { VapicOptions, VapicOptionsWithProviders } from "./types";

export const CLIENT_RESOLUTION_ORDER = ["auth", "local", "remote"] as const;

export async function createValorantApiClient<
  Options extends VapicOptionsWithProviders,
>(options: Options): Promise<ValorantApiClient> {
  return ValorantApiClient.init(options);
}

export class ValorantApiClient {
  #authApiClient?: AuthApiClient;
  #localApiClient?: LocalApiClient;
  #remoteApiClient?: RemoteApiClient;

  constructor(options: VapicOptions = {}) {
    if (options.auth) {
      this.#authApiClient = new AuthApiClient(options.auth);
    }

    if (options.local) {
      this.#localApiClient = new LocalApiClient(options.local);
    }

    if (options.remote) {
      options.remote.clientVersion =
        options.remote.clientVersion ?? options.auth?.clientVersion;

      this.#remoteApiClient = new RemoteApiClient(options.remote);
    }
  }

  static async init(
    options: VapicOptionsWithProviders,
  ): Promise<ValorantApiClient> {
    if (isOptionsWithoutProvider(options)) {
      return new ValorantApiClient(options);
    }

    const vapic = new ValorantApiClient();
    return vapic.reinit(options);
  }

  async reinit(options: VapicOptionsWithProviders) {
    for (const client of CLIENT_RESOLUTION_ORDER) {
      if (!options[client]) {
        continue;
      }

      const o = options[client];
      this.reinitSync({
        [client]: isProvider(o) ? await o(this) : o,
      });
    }

    return this;
  }

  reinitSync(options: VapicOptions) {
    if (options.auth) {
      if (this.#authApiClient) {
        this.#authApiClient.reinit(options.auth);
      } else {
        this.#authApiClient = new AuthApiClient(options.auth);
      }
    }

    if (options.local) {
      if (this.#localApiClient) {
        this.#localApiClient.reinit(options.local);
      } else {
        this.#localApiClient = new LocalApiClient(options.local);
      }
    }

    if (options.remote) {
      options.remote.clientVersion =
        options.remote.clientVersion ?? options.auth?.clientVersion;

      if (this.#remoteApiClient) {
        this.#remoteApiClient.reinit(options.remote);
      } else {
        this.#remoteApiClient = new RemoteApiClient(options.remote);
      }
    }

    return this;
  }

  get auth(): AuthApiClient {
    if (!this.#authApiClient) {
      throw new Error("AuthApiClient not initialized");
    }
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
