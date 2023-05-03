#!/usr/bin/env node
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";
import meow from "meow";

import { execa } from "../helpers/execa";
import { getFilePath } from "./endpoint.helpers";
import { generateEndpointTemplate } from "./endpoint.template";

const ENDPOINTS_DIR = "src/clients/offi-api/endpoints";
await mkdir(ENDPOINTS_DIR, { recursive: true }); // make sure endpoints directory exists

const cli = meow(
  `
	Usage
	  $ generate-endpoint <url>

	Examples
	  $ generate-endpoint 'https://valorant-api.com/v1/maps'
`,
  {
    importMeta: import.meta,
  }
);

const url = cli.input[0];

if (!url) {
  console.log("argument url is required");
  cli.showHelp();

  process.exit(1);
}

const filepath = getFilePath(ENDPOINTS_DIR, url);

console.log("=> Generating template...");
const template = await generateEndpointTemplate(url);
console.log(" ✓ Done!\n");

console.log("=> Writing file...");
await writeFile(filepath, template)
  .then(() => console.log(` - Written to ${filepath}`))
  .catch(e => {
    console.log(` - Error writing to file ${filepath}`);
    console.error(" - Error:", e.message);
  });
console.log(" ✓ Done!\n");

console.log(`=> Formatting ${filepath}`);
await execa(`prettier --write ${filepath}`);
console.log(" ✓ Done!\n");
