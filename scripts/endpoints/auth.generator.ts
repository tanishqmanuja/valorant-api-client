import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { endpoints } from "valorant-api-types";
import { paramCase } from "change-case";

import {
  AUTO_GENERATED_HEADER,
  ValorantEndpoints,
  checkImport,
  execa,
} from "scripts/helpers";
import { tAuthEndpointsClass, tAuthEndpoint } from "./templates/auth.templates";

const ENDPOINTS_DIR = "src/clients/auth-api/endpoints";
await mkdir(ENDPOINTS_DIR, { recursive: true });

console.log("=> Generating endpoints templates...");
const authEndpoints = await Promise.all(
  Object.entries(endpoints as ValorantEndpoints)
    .filter(
      ([_, e]) =>
        e.type === "other" && e.category === "Authentication Endpoints",
    )
    .map(async ([importName, endpoint]) => {
      return {
        importName,
        isImportAvailable: await checkImport(importName),
        endpoint,
      };
    }),
);

await Promise.all(
  authEndpoints.map(async ({ importName, isImportAvailable, endpoint }) => {
    if (!isImportAvailable) {
      console.log(`Skipping ${importName}`);
      return;
    }

    return writeFile(
      join(ENDPOINTS_DIR, `${paramCase(endpoint.name)}.ts`),
      AUTO_GENERATED_HEADER +
        tAuthEndpoint({
          importName,
          endpoint,
        }),
    );
  }),
);

await writeFile(
  join(ENDPOINTS_DIR, "index.ts"),
  AUTO_GENERATED_HEADER +
    tAuthEndpointsClass({
      endpointsList: authEndpoints
        .filter(e => e.isImportAvailable)
        .map(e => e.endpoint.name),
    }),
);

console.log("=> Formatting files...");
await execa(`prettier --write ${ENDPOINTS_DIR}/**/*.ts`);
console.log(" ✓ Done!\n");
