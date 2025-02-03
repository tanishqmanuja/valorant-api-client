import type { AxiosRequestConfig } from "axios";
import type {
  EmptyObject,
  IfAny,
  Merge,
  SetOptional,
  Simplify,
} from "type-fest";

// https://github.com/elysiajs/elysia/blob/main/src/types.ts
type IsPathParameter<Part extends string> = Part extends `:${infer Parameter}`
  ? Parameter
  : never;

export type GetPathParameter<Path extends string> =
  Path extends `${infer A}/${infer B}`
    ? IsPathParameter<A> | GetPathParameter<B>
    : IsPathParameter<Path>;

export type ResolvePath<Path extends string> = Simplify<
  {
    [Param in GetPathParameter<Path> as Param extends `${string}?`
      ? never
      : Param]: string;
  } & {
    [Param in GetPathParameter<Path> as Param extends `${infer OptionalParam}?`
      ? OptionalParam
      : never]?: string;
  }
>;

export type ResolveParams<
  Url extends string,
  Resolved = ResolvePath<Url>,
> = Resolved extends { puuid: any } ? SetOptional<Resolved, "puuid"> : Resolved;

export type ResolveValue<
  Object,
  Key extends string,
  FallbackType = any,
> = Object extends {
  [key in Key]: infer Value;
}
  ? Value
  : FallbackType;

export type ResolveData<
  Params,
  Body,
  Data = Merge<Params, IfAny<Body, EmptyObject, Body>>,
> = Data extends EmptyObject ? any : Data;

export type ValorantAxiosRequestConfig<
  T = any,
  K extends string = IfAny<T, never, "data">,
> = AxiosRequestConfig<T> & { [key in K]: T };
