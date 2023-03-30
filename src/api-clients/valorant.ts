import type { MaybePromise } from "~/utils/lib/typescript/promise.js";

import {
  AuthApiClient,
  AuthApiClientOptions,
  authApiClientOptionsSchema,
  createAuthApiClient,
} from "./auth.js";
import {
  LocalApiClient,
  LocalApiClientOptions,
  createLocalApiClient,
  localApiClientOptionsSchema,
} from "./local.js";
import {
  RemoteApiClient,
  RemoteApiClientOptions,
  createRemoteApiClient,
  remoteApiClientOptionsSchema,
} from "./remote.js";

export type LocalProviderContext = { authApiClient: AuthApiClient };
export type RemoteProviderContext = {
  authApiClient: AuthApiClient;
  localApiClient?: LocalApiClient;
};

export type clientTypeMap = {
  auth: {
    options: AuthApiClientOptions;
    client: AuthApiClient;
  };
  local: {
    context: LocalProviderContext;
    options: LocalApiClientOptions;
    client: LocalApiClient;
  };
  remote: {
    context: RemoteProviderContext;
    options: RemoteApiClientOptions;
    client: RemoteApiClient;
  };
};

export type ValorantApiClientOptions = {
  [type in keyof clientTypeMap]?: clientTypeMap[type] extends {
    context: infer C;
    options: infer O;
  }
    ? ((ctx: C) => MaybePromise<O>) | O
    : clientTypeMap[type]["options"];
};

export async function createValorantApiClient<
  Options extends ValorantApiClientOptions,
  Keys extends keyof Options & keyof clientTypeMap
>(options: Options) {
  const authApiClient = createAuthApiClient(
    authApiClientOptionsSchema.parse(options.auth ?? {})
  );

  let localApiClient: LocalApiClient | undefined = undefined;
  let remoteApiClient: RemoteApiClient | undefined = undefined;

  if (options.local) {
    if (typeof options.local === "function") {
      localApiClient = createLocalApiClient(
        localApiClientOptionsSchema.parse(
          await options.local({ authApiClient })
        )
      );
    } else {
      localApiClient = createLocalApiClient(options.local);
    }
  }

  if (options.remote) {
    if (typeof options.remote === "function") {
      remoteApiClient = createRemoteApiClient(
        remoteApiClientOptionsSchema.parse(
          await options.remote({ authApiClient, localApiClient })
        )
      );
    } else {
      remoteApiClient = createRemoteApiClient(options.remote);
    }
  }

  const apiClients = {
    auth: authApiClient,
    local: localApiClient,
    remote: remoteApiClient,
  } as { [K in Keys | "auth"]: clientTypeMap[K]["client"] };

  return {
    ...apiClients,
    getLocalProviderContext: () => ({ authApiClient }),
    getRemoteProviderContext: () => ({ authApiClient, localApiClient }),
  };
}

export type ValorantApiClient = ReturnType<typeof createValorantApiClient>;
