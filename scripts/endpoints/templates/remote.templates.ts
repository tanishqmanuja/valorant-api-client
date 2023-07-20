import { camelCase, pascalCase } from "change-case";
import { tIf, tImport, tImports } from "scripts/helpers";
import { ValorantEndpoint } from "valorant-api-types";
import { getSuffixParams } from "~/helpers";

const CLIENT_CLASS = "RemoteApiClient";
const CLIENT_CLASS_PATH = "~/clients/remote-api";
const ENDPOINT_CLASS_SUFFIX = "RemoteApiEndpoint";
const ENDPOINTS_WRAPPER_CLASS = "RemoteApiEndpoints";

type EndpointOptions = {
  importName: string;
  endpoint: ValorantEndpoint;
};

export const tRemoteEndpoint = (o: EndpointOptions) => {
  const { importName, endpoint: e } = o;

  e.method = e.method ?? "GET";

  const hasBody = Boolean(e.body);
  const hasResponses = Object.keys(e.responses || {}).length > 0;
  const statusCode = Object.keys(e.responses || {})[0] ?? "200";
  const suffixParams = getSuffixParams(e.suffix);
  const hasSuffixParams = suffixParams.length > 0;

  return `
${tImports([
  { named: "z", from: "zod", if: hasBody || hasResponses || hasSuffixParams },
  { default: "axios", named: "type AxiosResponse", from: "axios" },
  {
    named: "type AxiosRequestConfig",
    from: "axios",
    if: !(hasBody || hasSuffixParams),
  },
  { named: importName, from: "valorant-api-types" },
  {
    named: [
      "parseResponseDataFor",
      hasSuffixParams ? "buildSuffix" : undefined,
    ],
    from: "~/helpers/endpoints",
  },
  { named: "ensureArray", from: "~/utils/array" },
  {
    named: "AxiosRequestConfigWithData",
    from: "~/utils/lib/axios",
    if: hasBody || hasSuffixParams,
  },
  {
    named: "type CustomAxiosRequestConfig",
    from: "~/clients/common/types",
  },
  {
    named: `type ${CLIENT_CLASS}`,
    from: CLIENT_CLASS_PATH,
  },
])}

${tIf(
  hasBody,
  `type ${pascalCase(e.name)}BodyData = z.infer<typeof ${importName}.body>`,
)}

${tIf(
  hasSuffixParams,
  `type ${pascalCase(e.name)}SuffixData = {${suffixParams
    .map(p => `${camelCase(p)}: string;`)
    .join("\n")}}`,
)}

export interface ${pascalCase(e.name)}RequestConfig 
  extends ${
    hasBody || hasSuffixParams
      ? `AxiosRequestConfigWithData<${tIf(
          hasBody,
          `${pascalCase(e.name)}BodyData`,
        )}${tIf(hasBody && hasSuffixParams, " & ")}${tIf(
          hasSuffixParams,
          `${pascalCase(e.name)}SuffixData`,
        )}>`
      : "AxiosRequestConfig"
  }, CustomAxiosRequestConfig {};

export type ${pascalCase(
    e.name,
  )}Response = z.input<typeof ${importName}.responses["${statusCode}"]>

export type ${pascalCase(
    e.name,
  )}ParsedResponse = z.output<typeof ${importName}.responses["${statusCode}"]>

export class ${pascalCase(e.name)}${ENDPOINT_CLASS_SUFFIX} {
  /**
   * @description ${e.description.replaceAll("\n", "\n * ")}
   */
  ${camelCase(e.method + e.name)}<T = ${pascalCase(e.name)}ParsedResponse>(
    this: ${CLIENT_CLASS},
    ${`config: ${pascalCase(e.name)}RequestConfig & {parseResponseData: true},`}
  ): Promise<AxiosResponse<T>>
  ${camelCase(e.method + e.name)}<T = ${pascalCase(e.name)}Response>(
    this: ${CLIENT_CLASS},
    ${
      hasBody
        ? `config: ${pascalCase(e.name)}RequestConfig,`
        : `config?: ${pascalCase(e.name)}RequestConfig`
    }
  ): Promise<AxiosResponse<T>>
  ${camelCase(e.method + e.name)}<T = ${pascalCase(e.name)}Response>(
    this: ${CLIENT_CLASS},
    ${
      hasBody || hasSuffixParams
        ? `config: ${pascalCase(e.name)}RequestConfig,`
        : `config: ${pascalCase(e.name)}RequestConfig = {},`
    }
  ) {
    const shouldParseResponse =
      config.parseResponseData ?? this.options.parseResponseData;

    return this.axiosInstance<T>({
      method: "${e.method}",
      baseURL: this.getServerUrl(${importName}.type),
      url: ${
        hasSuffixParams
          ? `buildSuffix(${importName}.suffix, config.data)`
          : `${importName}.suffix`
      },
      ...config,
      transformRequest: [
        parseResponseDataFor(${importName}),
        ...ensureArray(axios.defaults.transformRequest),
      ],
      ...(shouldParseResponse
        ? {
            transformResponse: [
              ...ensureArray(axios.defaults.transformResponse),
              parseResponseDataFor(
                ${importName},
                config.customResponseParser,
              ),
            ],
          }
        : {}),
    });
  }
}`.trimStart();
};

type EndpointClassOptions = {
  endpointsList: Array<{ name: string; path: string }>;
};

export const tRemoteEndpointsClass = (o: EndpointClassOptions) => {
  return `
${o.endpointsList
  .map(({ name, path }) =>
    tImport({
      named: `${pascalCase(name)}${ENDPOINT_CLASS_SUFFIX}`,
      from: path,
    }),
  )
  .join("\n")}

${tImport({ named: "applyMixins", from: "~/utils/classes" })}

export class ${ENDPOINTS_WRAPPER_CLASS} {}

applyMixins(${ENDPOINTS_WRAPPER_CLASS}, [
  ${o.endpointsList
    .map(e => `${pascalCase(e.name)}${ENDPOINT_CLASS_SUFFIX}`)
    .join(",\n  ")}
])

export interface ${ENDPOINTS_WRAPPER_CLASS} extends ${o.endpointsList
    .map(e => `${pascalCase(e.name)}${ENDPOINT_CLASS_SUFFIX}`)
    .join(",\n  ")} {}
  `.trimStart();
};
