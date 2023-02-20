export function* execAllGenerator(str: string, regex: RegExp) {
  if (!regex.global) {
    console.error(
      "RegExp must have the global flag to retrieve multiple results."
    );
  }

  let match;
  while ((match = regex.exec(str))) {
    yield match;
  }
}
