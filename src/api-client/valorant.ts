import { ZodSchema } from "zod";

import { MaybePromise } from "~/utils/lib/typescript/promise.js";

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

export type AuthApiClientProvider = () => MaybePromise<
  Partial<AuthApiClientOptions>
>;
export type LocalApiClientProvider = (
  ctx: LocalProviderContext
) => MaybePromise<Partial<LocalApiClientOptions>>;
export type RemoteApiClientProvider = (
  ctx: RemoteProviderContext
) => MaybePromise<Partial<RemoteApiClientOptions>>;

export type ClientMapping = {
  auth: {
    context: {};
    options: AuthApiClientOptions;
    provider: AuthApiClientProvider;
    client: AuthApiClient;
  };
  local: {
    context: LocalProviderContext;
    options: LocalApiClientOptions;
    provider: LocalApiClientProvider;
    client: LocalApiClient;
  };
  remote: {
    context: RemoteProviderContext;
    options: RemoteApiClientOptions;
    provider: RemoteApiClientProvider;
    client: RemoteApiClient;
  };
};

export type ValorantApiClientOptions = {
  [k in keyof ClientMapping]?: {
    providers: readonly ClientMapping[k]["provider"][];
  };
};

async function resolveProviders<
  R,
  C,
  T extends (ctx: C) => MaybePromise<Partial<R>>
>(parser: ZodSchema<R>, providers: T[], ctx: C): Promise<R> {
  const promises = await Promise.all(providers.map(task => task(ctx)));
  const resolved = promises.reduce((opts, val) => ({ ...opts, ...val }));
  return parser.parse(resolved);
}

export async function createValorantApiClient<
  Options extends ValorantApiClientOptions,
  Keys extends keyof Options & keyof ClientMapping
>(options: Options) {
  const authApiClient = createAuthApiClient(
    options.auth
      ? await resolveProviders(
          authApiClientOptionsSchema,
          [...options.auth.providers],
          {}
        )
      : {}
  );

  let localApiClient: LocalApiClient | undefined = undefined;
  let remoteApiClient: RemoteApiClient | undefined = undefined;

  if (options.local) {
    localApiClient = createLocalApiClient(
      await resolveProviders(
        localApiClientOptionsSchema,
        [...options.local.providers],
        { authApiClient }
      )
    );
  }

  if (options.remote) {
    remoteApiClient = createRemoteApiClient(
      await resolveProviders(
        remoteApiClientOptionsSchema,
        [...options.remote.providers],
        { authApiClient, localApiClient }
      )
    );
  }

  const apiClients = {
    auth: authApiClient,
    local: localApiClient,
    remote: remoteApiClient,
  } as { [K in Keys | "auth"]: ClientMapping[K]["client"] };

  return {
    ...apiClients,
    getLocalProviderContext: () => ({ authApiClient }),
    getRemoteProviderContext: () => ({ authApiClient, localApiClient }),
  };
}

export type ValorantApiClient = ReturnType<typeof createValorantApiClient>;
