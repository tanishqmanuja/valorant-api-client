import { readFileSync, writeFileSync } from "fs";
import M from "mustache";
import { join } from "node:path";
import { cwd } from "process";
import { objectEntries } from "ts-extras";
import { ValorantEndpoint, endpoints } from "valorant-api-types";
import { findOKResponse, getFunctionName } from "~/helpers/endpoint.js";

type ValorantEndpointWithKey = ValorantEndpoint & { key: string };

function getFnName(this: ValorantEndpointWithKey) {
  const endpoint = this;
  return getFunctionName(endpoint);
}

function getFnArgs(this: ValorantEndpointWithKey) {
  const { key, method = "GET", body } = this;
  if (method === "POST" && body) {
    return `config: SetRequired<AxiosRequestConfig<z.infer<typeof endpoints.${key}.body>>, "data">`;
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
