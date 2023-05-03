/**
 * Generic tagged-template literal string concatenator with array value
 * flattening. Can be assigned to various tag names for syntax highlighting.
 */
const concat = (strings: TemplateStringsArray, ...values: unknown[]) =>
  values.reduce(
    (acc: string, v, i) =>
      acc + (Array.isArray(v) ? v.flat(Infinity).join("") : v) + strings[i + 1],
    strings[0]
  );

/**
 * Use https://marketplace.visualstudio.com/items?itemName=zjcompt.es6-string-javascript
 * for JS syntax highlighting
 */
export const javascript = concat;
