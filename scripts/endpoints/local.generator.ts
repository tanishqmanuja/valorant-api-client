import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { endpoints } from "@tqman/valorant-api-types";
import { paramCase } from "change-case";

import {
  AUTO_GENERATED_HEADER,
  type ValorantEndpoints,
  checkImport,
  execa,
} from "scripts/helpers";
import {
  tLocalEndpointsClass,
  tLocalEndpoint,
  tLocalEndpointsTypings,
} from "./templates/local.templates";

const ENDPOINTS_DIR = "src/clients/local-api/endpoints";
await mkdir(ENDPOINTS_DIR, { recursive: true });

console.log("=> Generating endpoints templates...");
const localEndpoints = await Promise.all(
  Object.entries(endpoints as ValorantEndpoints)
    .filter(([_, e]) => e.type === "local")
    .map(async ([importName, endpoint]) => {
      return {
        importName,
        isImportAvailable: await checkImport(importName),
        endpoint,
      };
    }),
);

await Promise.all(
  localEndpoints.map(async ({ importName, isImportAvailable, endpoint }) => {
    if (!isImportAvailable) {
      console.log(`Skipping ${importName}`);
      return;
    }

    return writeFile(
      join(ENDPOINTS_DIR, `${paramCase(endpoint.name)}.ts`),
      AUTO_GENERATED_HEADER +
        tLocalEndpoint({
          importName,
          endpoint,
        }),
    );
  }),
);

await writeFile(
  join(ENDPOINTS_DIR, "index.ts"),
  AUTO_GENERATED_HEADER +
    tLocalEndpointsClass({
      endpointsList: localEndpoints
        .filter(e => e.isImportAvailable)
        .map(e => e.endpoint.name),
    }),
);

await writeFile(
  join(ENDPOINTS_DIR, "types.ts"),
  AUTO_GENERATED_HEADER +
    tLocalEndpointsTypings({
      endpointsList: localEndpoints
        .filter(e => e.isImportAvailable)
        .map(e => e.endpoint.name),
    }),
);

console.log("=> Formatting files...");
await execa(`prettier --write ${ENDPOINTS_DIR}/**/*.ts`);
console.log(" ✓ Done!\n");
