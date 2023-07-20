type LocalWsTypingsOptions = {
  name: string;
  record: Record<string, any>;
};

export const tLocalWsEvents = (o: LocalWsTypingsOptions) => {
  return `
export const ${o.name.toUpperCase()} = ${JSON.stringify(
    Object.keys(o.record),
    null,
    2,
  )} as const
  `.trimStart();
};
