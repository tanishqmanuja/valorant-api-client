import { RequiredKeysOf, UnionToIntersection, IsEqual } from "type-fest";
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

type ProvidersReturnType<
  K extends keyof ClientMapping,
  P extends ClientMapping[K]["provider"][]
> = UnionToIntersection<Awaited<ReturnType<P[number]>>>;

type AreProvidersTotal<
  K extends keyof ClientMapping,
  P extends ClientMapping[K]["provider"][]
> = IsEqual<
  keyof ProvidersReturnType<K, P> & RequiredKeysOf<ClientMapping[K]["options"]>,
  RequiredKeysOf<ClientMapping[K]["options"]>
>;

export type ValorantApiClientOptions = {
  [k in keyof ClientMapping]?: {
    providers: ClientMapping[k]["provider"][];
  };
};

type isValidOptions<
  Opts extends ValorantApiClientOptions,
  RKeys extends keyof Opts & keyof ClientMapping = RequiredKeysOf<Opts> &
    keyof ClientMapping
> = RKeys extends keyof ClientMapping
  ? Opts[RKeys] extends {
      providers: ClientMapping[keyof ClientMapping]["provider"][];
    }
    ? { [K in RKeys]: AreProvidersTotal<K, Opts[RKeys]["providers"]> }
    : false
  : false;

type ParseOptions<
  Opts extends ValorantApiClientOptions,
  RKeys extends keyof Opts & keyof ClientMapping = RequiredKeysOf<Opts> &
    keyof ClientMapping,
  ValidityObj = UnionToIntersection<isValidOptions<Opts>>
> = ValidityObj extends { [k in RKeys]: true }
  ? Opts
  : {
      [k in keyof ValidityObj & RKeys]: ValidityObj[k] extends true
        ? Opts[k]
        : {
            providers: [() => MaybePromise<ClientMapping[k]["options"]>];
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
>(options: Options & ParseOptions<Options>) {
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
