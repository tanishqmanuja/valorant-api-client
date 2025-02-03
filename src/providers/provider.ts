import type { Simplify, UnionToIntersection } from "type-fest";

import { ensureArray } from "~/utils/array";
import type { MaybePromise } from "~/utils/promises";

export type Provider<
  TContext = any,
  TOptions extends Record<string, any> = Record<string, any>,
> = (ctx: TContext) => MaybePromise<Partial<TOptions>>;

export type ProvidersReturnType<Tproviders extends Provider[]> = Simplify<
  UnionToIntersection<Awaited<ReturnType<Tproviders[number]>>>
>;

export function useProviders<TContext, TProvider extends Provider<TContext>>(
  providers: TProvider[] | TProvider,
) {
  const _providers = ensureArray(providers);
  return (ctx: TContext) =>
    Promise.all(_providers.map((task) => task(ctx))).then((promises) =>
      promises.reduce((opts, val) => Object.assign(opts, val), {}),
    ) as Promise<ProvidersReturnType<TProvider[]>>;
}
