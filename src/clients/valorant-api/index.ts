import type { MaybePromise } from "~/utils/lib/typescript/promise.js";

import {
  AuthApiClient,
  AuthApiClientOptions,
  authApiClientOptionsSchema,
  createAuthApiClient,
} from "../auth-api/index.js";
import {
  OffiApiClient,
  OffiApiClientOptions,
  createOffiApiClient,
} from "../index.js";
import {
  LocalApiClient,
  LocalApiClientOptions,
  createLocalApiClient,
  localApiClientOptionsSchema,
} from "../local-api/index.js";
import {
  RemoteApiClient,
  RemoteApiClientOptions,
  createRemoteApiClient,
  remoteApiClientOptionsSchema,
} from "../remote-api/index.js";

export type LocalProviderContext = { authApiClient: AuthApiClient };
export type RemoteProviderContext = {
  authApiClient: AuthApiClient;
  localApiClient?: LocalApiClient;
};

export type ClientTypeMap = {
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
  offi: {
    options: OffiApiClientOptions;
    client: OffiApiClient;
  };
};

type AutoIncludedClients = "auth" | "offi";

export type ValorantApiClientOptions = {
  [type in keyof ClientTypeMap]?: ClientTypeMap[type] extends {
    context: infer C;
    options: infer O;
  }
    ? ((ctx: C) => MaybePromise<O>) | O
    : ClientTypeMap[type]["options"];
};

export async function createValorantApiClient<
  Options extends ValorantApiClientOptions,
  Keys extends keyof Options & keyof ClientTypeMap
>(options: Options) {
  const authApiClient = createAuthApiClient(
    authApiClientOptionsSchema.parse(options.auth ?? {})
  );

  const offiApiClient = createOffiApiClient(options.offi ?? {});

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
    offi: offiApiClient,
  } as { [K in Keys | AutoIncludedClients]: ClientTypeMap[K]["client"] };

  return {
    ...apiClients,
    getLocalProviderContext: () => ({ authApiClient }),
    getRemoteProviderContext: () => ({ authApiClient, localApiClient }),
  };
}

export type ValorantApiClient = Awaited<
  ReturnType<typeof createValorantApiClient>
>;
