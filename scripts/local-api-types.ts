import { readFileSync, writeFileSync } from "fs";
import M from "mustache";
import { join } from "node:path";
import { cwd } from "process";
import { objectEntries } from "ts-extras";
import { endpoints } from "valorant-api-types";
import { getFunctionName } from "../src/helpers/endpoint.js";

function getFnName() {
  const endpoint = this;
  return getFunctionName(endpoint);
}

function getFnArgs() {
  const { key, method = "GET", body } = this;
  if (method === "POST" && body) {
    return `config: SetRequired<AxiosRequestConfig<z.infer<typeof endpoints.${key}.body>>, "data">`;
  }
  return "config?: AxiosRequestConfig";
}

function getFnReturn() {
  const { key } = this;
  return `typeof endpoints.${key}.responses["200"]`;
}

const eps = objectEntries(endpoints)
  .filter(([_, e]) => e.type === "local")
  .reduce((arr, [key, e]) => [...arr, { key, ...e }], [] as any[]);

const filePath = join(cwd(), "./templates/local-api.ts.template");
const template = readFileSync(filePath, "utf-8");
const output = M.render(template, {
  endpoints: eps,
  fnName: getFnName,
  fnArgs: getFnArgs,
  fnReturn: getFnReturn,
});
writeFileSync(join(cwd(), "./src/types/local-api-type.ts"), output);
