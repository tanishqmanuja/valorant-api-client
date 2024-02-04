import { camelCase } from "change-case";
import type { AxiosRequestTransformer, AxiosResponseTransformer } from "axios";
import type { ValorantEndpoint } from "valorant-api-types";

import { execAllGenerator } from "~/utils/regex";

export function parseRequestDataFor(
  endpoint: ValorantEndpoint,
): AxiosRequestTransformer {
  return data => endpoint.body?.parse(data) ?? data;
}

export function parseResponseDataFor(
  endpoint: ValorantEndpoint,
  customParser?: (data: any) => any,
): AxiosResponseTransformer {
  return (data, _, status) => {
    if (!status) {
      return data;
    }

    const schema = endpoint.responses?.[`${status}`];
    const parser = customParser ?? schema?.parse;
    return parser?.(data) ?? data;
  };
}

export function getSuffixParams(suffix: string) {
  const argPattern = /{(?<arg>.*?)}/g;
  const args = [...execAllGenerator(suffix, argPattern)]
    .map(match => match?.groups?.arg)
    .filter(Boolean) as string[];

  return args;
}

export function buildSuffix(suffix: string, params: Record<string, unknown>) {
  const args = getSuffixParams(suffix);

  for (const arg of args) {
    if (!params.hasOwnProperty(camelCase(arg))) {
      throw Error("Missing param: " + arg);
    } else {
      suffix = suffix.replace(
        RegExp(`{${arg}}`),
        String(params[camelCase(arg)]),
      );
    }
  }

  return suffix;
}
