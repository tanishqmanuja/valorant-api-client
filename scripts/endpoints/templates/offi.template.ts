import axios from "axios";
import { json2ts } from "json-ts";
import { generate } from "ts-to-zod";
import { tImports } from "../../helpers";
import { paramCase, pascalCase } from "change-case";

const TYPES_IMPORT_PATH = "~/clients/offi-api/types";

type EndpointOptions = {
  url: string;
  name: string;
};

/* FILENAME: endpoints/__name__.ts */
export const tOffiEndpoint = async (o: EndpointOptions) => {
  const { url, name } = o;
  const { data } = await axios.get(url);

  const tsInterfaces = json2ts(JSON.stringify(data.data), {
    rootName: name,
    prefix: name,
  });

  const zodSchemas = generate({
    sourceText: tsInterfaces,
  })
    .getZodSchemasFile("zod")
    .split("\n")
    .splice(3) // remove imports
    .slice(0, -1) // remove last empty line
    .join("\n")
    .replace(new RegExp(`(${name}){2}`, "gi"), name) // remove duplicate schema prefix
    .replaceAll("const", "export const");

  return `
${tImports([
  { named: "z", from: "zod" },
  { named: "type OffiApiEndpoint", from: TYPES_IMPORT_PATH },
])}

${zodSchemas}

export type ${pascalCase(name)} = z.infer<typeof ${name}Schema>;

export const ${pascalCase(name)}Endpoint = {
  url: "${url}",
  schema: ${name}Schema,
} as const satisfies OffiApiEndpoint;
  `.trimStart();
};

/* FILENAME: endpoints/endpoints.ts */
export const tOffiEndpointsWrapper = (e: { name: string }[]) => {
  return `
${tImports(
  e.map(({ name }) => ({
    named: pascalCase(name) + "Endpoint",
    from: "./" + paramCase(name),
  })),
)}

export const endpoints = {${e
    .map(({ name }) => `${name}: ${pascalCase(name)}Endpoint`)
    .join(",\n")}}

export type Endpoints = keyof typeof endpoints;
  `.trimStart();
};

/* FILENAME: endpoints/index.ts */
export const tOffiEndpointsBarrel = (e: { name: string }[]) => {
  return `
${e.map(({ name }) => `export * from "./${name}";`).join("\n")}

export * from "./endpoints";
  `.trimStart();
};
