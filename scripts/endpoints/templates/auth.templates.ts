import type { ValorantEndpoint } from "@tqman/valorant-api-types";
import { camelCase, kebabCase, pascalCase } from "change-case";
import { tIf, tImport, tImports } from "scripts/helpers";

const CLIENT_CLASS = "AuthApiClient";
const CLIENT_CLASS_PATH = "~/clients/auth-api";
const ENDPOINT_CLASS_SUFFIX = "AuthApiEndpoint";
const ENDPOINTS_WRAPPER_CLASS = "AuthApiEndpoints";

type EndpointOptions = {
  importName: string;
  endpoint: ValorantEndpoint;
};

export const tAuthEndpoint = (o: EndpointOptions) => {
  const { importName, endpoint: e } = o;

  e.method = e.method ?? "GET";

  const hasBody = Boolean(e.body);
  const hasHeaders = Boolean(e.headers);
  const hasResponses = Object.keys(e.responses || {}).length > 0;
  const statusCode = Object.keys(e.responses || {})[0] ?? "200";

  return `
${tImports([
  { named: "z", from: "zod", if: hasBody || hasResponses },
  { named: "type AxiosRequestConfig", from: "axios", if: !hasBody },
  { named: importName, from: "@tqman/valorant-api-types" },
  { named: `type ${CLIENT_CLASS}`, from: CLIENT_CLASS_PATH },
  { named: "type CustomAxiosRequestConfig", from: "~/clients/common/types" },
  {
    named: "type AxiosRequestConfigWithData",
    from: "~/utils/lib/axios",
    if: hasBody,
  },
])}

${tIf(
  hasBody,
  `type ${pascalCase(e.name)}BodyData = z.infer<typeof ${importName}.body>`,
)}

export interface ${pascalCase(e.name)}RequestConfig 
  extends ${
    hasBody
      ? `AxiosRequestConfigWithData<${pascalCase(e.name)}BodyData>`
      : "AxiosRequestConfig"
  }, CustomAxiosRequestConfig {};

${tIf(
  hasResponses,
  `export type ${pascalCase(
    e.name,
  )}Response = z.infer<typeof ${importName}.responses["${statusCode}"]>`,
)}


export class ${pascalCase(e.name) + ENDPOINT_CLASS_SUFFIX} {
  /**
   * @description ${e.description.replaceAll("\n", "\n * ")}
   */
  ${camelCase(e.method + e.name)}<T = ${
    hasResponses ? pascalCase(e.name) + "Response" : "any"
  }>(
    this: ${CLIENT_CLASS},
    ${
      hasBody
        ? `config: ${pascalCase(e.name)}RequestConfig,`
        : `config: ${pascalCase(e.name)}RequestConfig = {},`
    }
  ) {
    return this.axiosInstance<T>({
      method: "${e.method}",
      url: ${importName}.suffix,
      ${tIf(hasHeaders, `headers: Object.fromEntries(${importName}.headers),`)}
      ...config,
    });
  }
}`.trimStart();
};

type EndpointClassOptions = {
  endpointsList: string[];
};

export const tAuthEndpointsClass = (o: EndpointClassOptions) => {
  return `
${o.endpointsList
  .map(it =>
    tImport({
      named: `${pascalCase(it) + ENDPOINT_CLASS_SUFFIX}`,
      from: `./${kebabCase(it)}`,
    }),
  )
  .join("\n")}

${tImport({ named: "applyMixins", from: "~/utils/classes" })}

export class ${ENDPOINTS_WRAPPER_CLASS} {}

applyMixins(${ENDPOINTS_WRAPPER_CLASS}, [
  ${o.endpointsList
    .map(e => `${pascalCase(e) + ENDPOINT_CLASS_SUFFIX}`)
    .join(",\n  ")}
])

export interface ${ENDPOINTS_WRAPPER_CLASS} extends ${o.endpointsList
    .map(e => `${pascalCase(e) + ENDPOINT_CLASS_SUFFIX}`)
    .join(",\n  ")} {}
  `.trimStart();
};
