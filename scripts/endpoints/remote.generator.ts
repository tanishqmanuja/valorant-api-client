import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { endpoints } from "valorant-api-types";
import { paramCase } from "change-case";

import {
  AUTO_GENERATED_HEADER,
  ValorantEndpoints,
  checkImport,
} from "scripts/endpoints/helpers";
import {
  tRemoteEndpointsClass,
  tRemoteEndpoint,
} from "./templates/remote.templates";

const ENDPOINTS_DIR = "src/clients/remote-api/endpoints";
await mkdir(ENDPOINTS_DIR, { recursive: true });

const remoteEndpoints = await Promise.all(
  Object.entries(endpoints as ValorantEndpoints)
    .filter(([_, e]) => e.type !== "local" && e.type !== "other")
    .map(async ([importName, endpoint]) => {
      return {
        importName,
        isImportAvailable: await checkImport(importName),
        endpoint,
      };
    }),
);

await Promise.all(
  remoteEndpoints.map(async ({ importName, isImportAvailable, endpoint }) => {
    if (!isImportAvailable) {
      console.log(`Skipping ${importName}`);
      return;
    }

    await mkdir(join(ENDPOINTS_DIR, paramCase(endpoint.type)), {
      recursive: true,
    });

    return writeFile(
      join(
        ENDPOINTS_DIR,
        paramCase(endpoint.type),
        `${paramCase(endpoint.name)}.ts`,
      ),
      AUTO_GENERATED_HEADER +
        tRemoteEndpoint({
          importName,
          endpoint,
        }),
    );
  }),
);

await writeFile(
  join(ENDPOINTS_DIR, "index.ts"),
  AUTO_GENERATED_HEADER +
    tRemoteEndpointsClass({
      endpointsList: remoteEndpoints
        .filter(e => e.isImportAvailable)
        .map(({ endpoint }) => ({
          name: endpoint.name,
          path: `./${paramCase(endpoint.type)}/${paramCase(endpoint.name)}`,
        })),
    }),
);

console.log("Done!");
