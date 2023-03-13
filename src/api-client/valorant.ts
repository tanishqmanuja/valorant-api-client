import { Simplify, UnionToIntersection } from "type-fest";
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

export type Provider<TContext = any, TOptions = any> = (
  ctx: TContext
) => MaybePromise<Partial<TOptions>>;

export type ProvidersReturnType<Tproviders extends Provider[]> = Simplify<
  UnionToIntersection<Awaited<ReturnType<Tproviders[number]>>>
>;

export type clientTypeMap = {
  auth: {
    options: AuthApiClientOptions;
    client: AuthApiClient;
  };
  local: {
    context: LocalProviderContext;
    options: LocalApiClientOptions;
    provider: Provider<LocalProviderContext, LocalApiClientOptions>;
    client: LocalApiClient;
  };
  remote: {
    context: RemoteProviderContext;
    options: RemoteApiClientOptions;
    provider: Provider<RemoteProviderContext, RemoteApiClientOptions>;
    client: RemoteApiClient;
  };
};

export const clientParsersMap = {
  auth: authApiClientOptionsSchema,
  local: localApiClientOptionsSchema,
  remote: remoteApiClientOptionsSchema,
};

export type ValorantApiClientOptions = {
  [type in keyof clientTypeMap]?: clientTypeMap[type] extends {
    context: infer C;
    options: infer O;
  }
    ? ((ctx: C) => MaybePromise<O>) | O
    : clientTypeMap[type]["options"];
};

export function useProviders<TContext, TProviders extends Provider<TContext>[]>(
  providers: TProviders
) {
  return (ctx: TContext) =>
    Promise.all(providers.map(task => task(ctx))).then(promises =>
      promises.reduce((opts, val) => ({ ...opts, ...val }))
    ) as Promise<ProvidersReturnType<TProviders>>;
}

export async function resolveOptions<TOptions>(
  parser: ZodSchema<TOptions>,
  options: TOptions
): Promise<TOptions> {
  return parser.parse(options);
}

export async function createValorantApiClient<
  Options extends ValorantApiClientOptions,
  Keys extends keyof Options & keyof clientTypeMap
>(options: Options) {
  const authApiClient = createAuthApiClient(options.auth);

  let localApiClient: LocalApiClient | undefined = undefined;
  let remoteApiClient: RemoteApiClient | undefined = undefined;

  if (options.local) {
    if (typeof options.local === "function") {
      localApiClient = createLocalApiClient(
        await resolveOptions(
          clientParsersMap.local,
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
        await resolveOptions(
          clientParsersMap.remote,
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
