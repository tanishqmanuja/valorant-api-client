import type { Simplify, UnionToIntersection } from "type-fest";

import type { MaybePromise } from "~/utils/lib/typescript/promise";

export type Provider<TContext = any, TOptions = any> = (
  ctx: TContext
) => MaybePromise<Partial<TOptions>>;

export type ProvidersReturnType<Tproviders extends Provider[]> = Simplify<
  UnionToIntersection<Awaited<ReturnType<Tproviders[number]>>>
>;

export function useProviders<TContext, TProviders extends Provider<TContext>[]>(
  providers: TProviders
) {
  return (ctx: TContext) =>
    Promise.all(providers.map(task => task(ctx))).then(promises =>
      promises.reduce((opts, val) => ({ ...opts, ...val }))
    ) as Promise<ProvidersReturnType<TProviders>>;
}
