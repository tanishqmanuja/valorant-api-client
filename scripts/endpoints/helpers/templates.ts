export type ImportOptions = {
  default?: string;
  named?: string | Array<string | undefined>;
  from: string;
  if?: boolean;
};

export function tImport(o: ImportOptions): string {
  if (Object.hasOwn(o, "if") && !Boolean(o.if)) {
    return "";
  }

  let importString = "import";

  if (o.default) {
    importString += ` ${o.default}`;
  }

  if (o.named && o.named.length > 0) {
    if (o.default) {
      importString += ",";
    }

    if (typeof o.named === "string") {
      importString += ` { ${o.named} }`;
    } else {
      importString += ` { ${o.named.filter(Boolean).join(", ")} }`;
    }
  }
  return importString + ` from "${o.from}";`;
}

export function tImports(o: Array<ImportOptions>): string {
  return o
    .map(it => tImport(it))
    .filter(it => Boolean(it))
    .join("\n");
}

export function tIf(predicate: unknown, t: string, f?: string): string {
  if (Boolean(predicate)) {
    return t;
  } else {
    return f || "";
  }
}
