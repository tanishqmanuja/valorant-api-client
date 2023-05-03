import { writeFile } from "fs/promises";
import { join } from "path";
import { execa } from "scripts/helpers/execa";
import { AUTO_GEN_HEADER } from "scripts/helpers/template";

import {
  createValorantApiClient,
  provideLockFile,
  useProviders,
} from "~/index.js";
import { javascript } from "~/utils/template";

const OUT_DIR = "src/clients/local-ws";

const filepath = join(OUT_DIR, "events.autogen.ts");

const vapic = await createValorantApiClient({
  local: useProviders([provideLockFile()]),
}).catch(e => {
  console.log("Make sure Valorant is running!");
  console.error("Error:", e.message);
  process.exit(1);
});

const { data: help } = await vapic.local.api.getLocalHelp();

const template =
  AUTO_GEN_HEADER +
  javascript`export const EVENTS = ${JSON.stringify(
    Object.keys(help.events),
    null,
    2
  )} as const
`;

await writeFile(filepath, template)
  .then(() => console.log(`Written to ${filepath}`))
  .catch(e => {
    console.log(`Error writing to file ${filepath}`);
    console.error("Error:", e.message);
  });

await execa(`prettier --write ${filepath}`);
console.log(`Formatted file ${filepath}`);
