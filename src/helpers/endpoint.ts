import { pipe } from "fp-ts/lib/function.js";
import { objectEntries, objectKeys } from "ts-extras";
import { ValorantEndpoint } from "valorant-api-types";
import z from "zod";
import { execAllGenerator } from "../utils/regex.js";
import { removeCharaters, toCamelCase } from "../utils/string.js";

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
    return suffix.replace(regex, args[key]);
  }, suffix);
}
