import type { HasRequiredKeys, Simplify } from "type-fest";

type IsPathParameter<Part extends string> = Part extends `:${infer Parameter}`
  ? Parameter
  : never;

export type GetPathParameter<Path extends string> =
  Path extends `${infer A}/${infer B}`
    ? IsPathParameter<A> | GetPathParameter<B>
    : IsPathParameter<Path>;

export type ExtractPathParams<Path extends string> = Simplify<
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

export type PathOptions<TPathObj extends object> =
  HasRequiredKeys<TPathObj> extends true
    ? {
        path: TPathObj;
      }
    : {
        path?: TPathObj;
      };
