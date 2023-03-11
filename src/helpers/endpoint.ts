import { pipe } from "fp-ts/lib/function.js";
import { objectEntries, objectKeys } from "ts-extras";
import { ValorantEndpoint } from "valorant-api-types";
import z from "zod";

import { execAllGenerator } from "~/utils/regex.js";
import { removeCharaters, toCamelCase } from "~/utils/string.js";

export function getFunctionName(endpoint: ValorantEndpoint) {
  const { method = "GET", name } = endpoint;
  return pipe(`${method.toLowerCase()} ${name}`, toCamelCase, removeCharaters);
}

export function getArgsMap(suffix: string) {
  const argPattern = /{(?<arg>.*?)}/g;
  const args = [...execAllGenerator(suffix, argPattern)]
    .map(match => match?.groups?.arg)
    .filter(Boolean);
  return args.reduce(
    (acc, arg) => ({ ...acc, [toCamelCase(arg!)]: arg! }),
    {} as Record<string, string>
  );
}

export function getArgsZodSchema(argsMap: Record<string, string>) {
  const keys = objectKeys(argsMap);

  return z.object(
    keys.reduce((obj, key) => {
      obj[key] = z.string();
      return obj;
    }, {} as Record<string, z.ZodString>)
  );
}

export function replaceSuffixArgs(
  suffix: string,
  args: Record<string, string>,
  argsMap: Record<string, string>
) {
  return objectEntries(argsMap).reduce((endpoint, [key, param]) => {
    const regex = RegExp(`{${param}}`);
    return endpoint.replace(regex, args[key]);
  }, suffix);
}

export function findOKResponse(endpoint: ValorantEndpoint) {
  if (!endpoint.responses) {
    throw Error(`No responses for ${endpoint.name}`);
  }

  const res = objectEntries(endpoint.responses)
    .filter(([k]) => k.startsWith("2"))
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([code, schema]) => ({ code, schema }))
    .at(0);

  if (!res) {
    throw Error(`No OK responses for ${endpoint.name}`);
  }

  return res;
}

export function parseRequestData<T>(endpoint: ValorantEndpoint, data: T) {
  return endpoint.body?.parse(data);
}

export function parseResponseData<T>(
  endpoint: ValorantEndpoint,
  data: T,
  status: number
) {
  const schema = endpoint.responses?.[`${status}`];
  return schema?.parse(data);
}

export function buildSuffixUrl<T>(suffix: string, data: T) {
  const argsMap = getArgsMap(suffix);
  const argsSchema = getArgsZodSchema(argsMap);
  const args = argsSchema.parse(data);
  return replaceSuffixArgs(suffix, args, argsMap);
}
