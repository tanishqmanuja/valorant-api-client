import axios from "axios";
import { json2ts } from "json-ts";
import { AUTO_GEN_HEADER } from "scripts/helpers/template";
import { generate } from "ts-to-zod";

import { capitalizeFirstLetter } from "~/utils/string";
import { javascript } from "~/utils/template";

const TYPES_IMPORT_PATH = "~/clients/offi-api/types";
const ZOD_IMPORT_PATH = "zod";

export async function generateEndpointTemplate(url: string) {
  const parsedUrl = new URL(url);
  const rootName = parsedUrl.pathname.split("/").at(-1)?.toLowerCase();

  if (!rootName) {
    throw new Error("cannot find root name from url");
  }

  const { data } = await axios.get(url);

  const imports = [
    javascript`import { z } from "${ZOD_IMPORT_PATH}";`,
    javascript`import type { OffiApiEndpoint } from "${TYPES_IMPORT_PATH}";`,
  ].join("\n");

  const tsInterfaces = json2ts(JSON.stringify(data.data), {
    rootName,
    prefix: "",
  });

  const zodSchemas = generate({
    sourceText: tsInterfaces,
  })
    .getZodSchemasFile(ZOD_IMPORT_PATH)
    .split("\n")
    .splice(3) // remove imports
    .slice(0, -1) // remove last empty line
    .join("\n")
    .replaceAll("const", "export const");

  const inferredTypeExports = javascript`
  export type ${capitalizeFirstLetter(
    rootName
  )} = z.infer<typeof ${rootName}Schema>;
  `;

  const endpointExport = javascript`
  export const ${capitalizeFirstLetter(rootName)}Endpoint = {
    url: "${url}",
    schema: ${rootName}Schema,
  } as const satisfies OffiApiEndpoint;
  `;

  const template = [
    imports,
    zodSchemas,
    inferredTypeExports,
    endpointExport,
  ].join("\n\n");

  return AUTO_GEN_HEADER + template;
}
