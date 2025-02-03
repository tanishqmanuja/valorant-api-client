import path from "path";

import { Glob } from "bun";
import { pascalCase } from "change-case";
import { Edge } from "edge.js";

import type { ValorantEndpoint } from "~/endpoints/schema";
import { getUrlParams } from "~/helpers/url";

const SRC_DIR = "./src";
const TEMPLATES_DIR = `./src/endpoints/templates/`;

const VERBOSE = process.argv.includes("--verbose");

// Relative to SRC_DIR
const getEndpointDir = (type: ClientType) => `./endpoints/${type}/`;
const getOutputDir = (type: ClientType) => `./clients/${type}/endpoints`;

const CLIENT_TYPES = ["auth", "local", "remote"] as const;
type ClientType = (typeof CLIENT_TYPES)[number];

const getClientType = (type: ValorantEndpoint["type"]) => {
  switch (type) {
    case "glz":
    case "pd":
    case "shared":
      return "remote";
    default:
      return type;
  }
};

const edge = Edge.create();
edge.mount(path.resolve(TEMPLATES_DIR));

const glob = new Glob("**/*.ts");

const removeExtension = (file: string) =>
  file.substring(0, file.lastIndexOf(".")) || file;

const getData = async (type: ClientType) => {
  const files = await Array.fromAsync(
    glob.scan({ cwd: path.resolve(SRC_DIR, getEndpointDir(type)) }),
  );

  if (VERBOSE) {
    console.log(`${type.toUpperCase()} ENDPOINTS (${files.length})`, files);
  }

  return Promise.all(
    files.map(async (file) => {
      const module = await import(
        path.resolve(SRC_DIR, getEndpointDir(type), file)
      );
      const endpoint = module.default as ValorantEndpoint;
      if (!endpoint) {
        return;
      }

      const posixfile = file.replaceAll(path.sep, path.posix.sep);

      return {
        CLIENT_TYPE: getClientType(endpoint.type),
        ENDPOINT_FILE: file,
        ENDPOINT_IMPORT: removeExtension(posixfile),
        ENDPOINT_NAME: pascalCase(endpoint.name),
        ENDPOINT_DESCRIPTION: endpoint.description,
        ENDPOINT_TYPE: endpoint.type,
        ENDPOINT_METHOD: endpoint.method.toLowerCase(),
        EXPECTED_STATUS: Object.keys(endpoint.responses || {})[0] ?? "200",
        ENDPOINT_REQUIRES_CONFIG:
          endpoint.body ||
          getUrlParams(endpoint.url).filter((p) => p !== "puuid").length > 0,
      };
    }),
  );
};

const results = await Promise.all(
  CLIENT_TYPES.map(async (clientType) => {
    const data = await getData(clientType);

    // write endpoints
    await Promise.all(
      data.filter(Boolean).map(async (d) => {
        const rendered = await edge.render("endpoint", d);
        await Bun.write(
          path.resolve(SRC_DIR, getOutputDir(clientType), d!.ENDPOINT_FILE),
          rendered,
        );
      }),
    );

    // write mixin class
    await Bun.write(
      path.resolve(SRC_DIR, getOutputDir(clientType), "index.ts"),
      await edge.render("mixin", {
        MIXIN_CLASS_NAME: `${pascalCase(clientType)}ApiEndpoints`,
        ENDPOINTS: data,
      }),
    );

    return data.filter(Boolean).length;
  }),
);

console.log(
  "TOTAL ENDPOINTS WRITTEN",
  results.reduce((a, b) => a + b, 0),
);
