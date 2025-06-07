export function ensureArray<T>(input: T | T[] | undefined) {
  if (!input) {
    return [];
  } else if (input instanceof Array) {
    return input;
  } else {
    return [input];
  }
}
