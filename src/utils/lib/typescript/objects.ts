export type ReplaceValueAny<T, To> = T extends (...args: any[]) => any
  ? T
  : { [K in keyof T]: To };

export type ReplaceValue<T, From, To> = T extends (...args: any[]) => any
  ? T
  : { [K in keyof T]: [T[K], From] extends [From, T[K]] ? To : T[K] };

export type ReplaceValueRecursive<T, From, To> = T extends (
  ...args: any[]
) => any
  ? T
  : {
      [K in keyof T]: [T[K], From] extends [From, T[K]]
        ? To
        : ReplaceValueRecursive<T[K], From, To>;
    };
