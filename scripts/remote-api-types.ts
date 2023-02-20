import { pipe } from "fp-ts/lib/function.js";
import { readFileSync, writeFileSync } from "fs";
import M from "mustache";
import { join } from "node:path";
import { cwd } from "process";
import { objectEntries } from "ts-extras";
import { endpoints } from "valorant-api-types";
import { getArgsMap, getFunctionName } from "../src/helpers/endpoint.js";
import { removeCharaters, toCamelCase } from "../src/utils/string.js";

function getFnName() {
  const endpoint = this;
  return getFunctionName(endpoint);
}

function getFnArgs() {
  const { key, body, suffix } = this;
  if (typeof body === "object") {
    return `config: SetRequired<AxiosRequestConfig<z.infer<typeof endpoints.${key}.body>>, "data">`;
  }

  const argsMap = getArgsMap(suffix);
  if (Object.keys(argsMap).length > 0) {
    const args = Object.keys(argsMap).reduce(
      (arr, k) => [...arr, `${pipe(k, toCamelCase, removeCharaters)}: string`],
      [] as any[]
    );
    const argsSchema = `{${args.join(",")}}`;
    return `config: SetRequired<AxiosRequestConfig<${argsSchema}>, "data">`;
  }

  return "config?: AxiosRequestConfig";
}

function getFnReturn() {
  const { key, responses } = this;
  if (responses["200"]) {
    return `typeof endpoints.${key}.responses["200"]`;
  }
  return `typeof endpoints.${key}.responses["${Object.keys(responses)[0]}"]`;
}

const eps = objectEntries(endpoints)
  .filter(([_, e]) => e.type !== "local" && e.type !== "other")
  .reduce((arr, [key, e]) => [...arr, { key, ...e }], [] as any[]);

const filePath = join(cwd(), "./templates/remote-api.ts.template");
const template = readFileSync(filePath, "utf-8");
const output = M.render(template, {
  endpoints: eps,
  fnName: getFnName,
  fnArgs: getFnArgs,
  fnReturn: getFnReturn,
});
writeFileSync(join(cwd(), "./src/types/remote-api-type.ts"), output);
