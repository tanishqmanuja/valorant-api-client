import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { AUTO_GENERATED_HEADER, execa } from "scripts/helpers";

import { createValorantApiClient } from "~/clients/valorant-api";
import { provideLockFile, useProviders } from "~/providers";
import { tLocalWsEvents } from "./templates/local.templates";

const TYPES_DIR = "src/clients/local-ws/types";
await mkdir(TYPES_DIR, { recursive: true });

console.log("=> Generating endpoints templates...");

const vapic = await createValorantApiClient({
  local: useProviders([provideLockFile()]),
}).catch(e => {
  console.log("Make sure Valorant is running!");
  console.error("Error:", e.message);
  process.exit(1);
});

const { data: help } = await vapic.local.getLocalHelp();

await writeFile(
  join(TYPES_DIR, "events.ts"),
  AUTO_GENERATED_HEADER +
    tLocalWsEvents({ name: "events", record: help.events }),
);

await writeFile(
  join(TYPES_DIR, "functions.ts"),
  AUTO_GENERATED_HEADER +
    tLocalWsEvents({ name: "functions", record: help.functions }),
);

console.log("=> Formatting files...");
await execa(`prettier --write ${TYPES_DIR}/**/*.ts`);
console.log(" ✓ Done!\n");
