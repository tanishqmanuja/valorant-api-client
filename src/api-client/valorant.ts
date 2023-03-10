import { ZodSchema } from "zod";
import {
  AuthApiClient,
  AuthApiClientOptions,
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
import { MaybePromise } from "~/utils/lib/typescript/promise.js";
import {
  RequiredKeysOf,
  SetRequired,
  Simplify,
  UnionToIntersection,
} from "type-fest";

export type LocalContext = { authApiClient: AuthApiClient };
export type RemoteContext = {
  authApiClient: AuthApiClient;
  localApiClient?: LocalApiClient;
};
export type LocalProvider = (
  ctx: LocalContext
) => MaybePromise<Partial<LocalApiClientOptions>>;
export type RemoteProvider = (
  ctx: RemoteContext
) => MaybePromise<Partial<RemoteApiClientOptions>>;

export type ValorantApiClientOptions = {
  auth?: AuthApiClientOptions;
  local?: Partial<LocalApiClientOptions> & { providers: LocalProvider[] };
  remote?: Partial<RemoteApiClientOptions> & { providers: RemoteProvider[] };
};

export type ValorantApiClient = {
  auth: AuthApiClient;
  local?: LocalApiClient;
  remote?: RemoteApiClient;
};

export type ValorantApiClientInferred<Keys extends keyof ValorantApiClient> =
  Pick<SetRequired<ValorantApiClient, Keys>, Keys> &
    Pick<ValorantApiClient, RequiredKeysOf<ValorantApiClient>>;

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
  Options extends ValorantApiClientOptions
>(
  options: Options
): Promise<
  keyof Options extends keyof ValorantApiClient
    ? ValorantApiClientInferred<keyof Options>
    : ValorantApiClient
> {
  const authApiClient = createAuthApiClient(options.auth);

  let localApiClient: LocalApiClient | undefined = undefined;
  let remoteApiClient: RemoteApiClient | undefined = undefined;

  if (options.local) {
    localApiClient = createLocalApiClient(
      await resolveProviders(
        localApiClientOptionsSchema,
        [() => ({ ...options.local }), ...options.local.providers],
        { authApiClient }
      )
    );
  }

  if (options.remote) {
    remoteApiClient = createRemoteApiClient(
      await resolveProviders(
        remoteApiClientOptionsSchema,
        [() => ({ ...options.remote }), ...options.remote.providers],
        { authApiClient, localApiClient }
      )
    );
  }

  return {
    auth: authApiClient,
    local: localApiClient,
    remote: remoteApiClient,
  } as any;
}
