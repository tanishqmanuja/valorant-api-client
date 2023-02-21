import { pipe } from "fp-ts/lib/function.js";
import { readFileSync, writeFileSync } from "fs";
import M from "mustache";
import { join } from "node:path";
import { cwd } from "process";
import { objectEntries } from "ts-extras";
import { ValorantEndpoint, endpoints } from "valorant-api-types";
import {
  findOKResponse,
  getArgsMap,
  getFunctionName,
} from "~/helpers/endpoint.js";
import { removeCharaters, toCamelCase } from "~/utils/string.js";

type ValorantEndpointWithKey = ValorantEndpoint & { key: string };

function getFnName(this: ValorantEndpointWithKey) {
  const endpoint = this;
  return getFunctionName(endpoint);
}

function getFnArgs(this: ValorantEndpointWithKey) {
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

function getFnReturn(this: ValorantEndpointWithKey) {
  const endpoint = this;
  const { key } = endpoint;
  const { code } = findOKResponse(endpoint);
  return `typeof endpoints.${key}.responses["${code}"]`;
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
