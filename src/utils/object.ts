export function stripKeys<T extends object, K extends string[]>(
  obj: T,
  keys: K,
) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key)),
  );
}
