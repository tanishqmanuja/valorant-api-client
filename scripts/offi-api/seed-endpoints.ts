import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

import { capitalizeFirstLetter } from "~/utils/string";
import { javascript } from "~/utils/template";

import { execa } from "../helpers/execa";
import { NEXTLINE, AUTO_GEN_HEADER } from "../helpers/template";
import { getFilePath, guessEndpointName } from "./endpoint.helpers";
import { generateEndpointTemplate } from "./endpoint.template";

const ENDPOINTS_DIR = "src/clients/offi-api/endpoints";
await mkdir(ENDPOINTS_DIR, { recursive: true }); // make sure endpoints directory exists

const baseUrl = "https://valorant-api.com";
const versionRoute = "/v1";

const ENDPOINTS = [
  "/agents?isPlayableCharacter=true",
  "/buddies",
  "/bundles",
  "/ceremonies",
  "/competitivetiers",
  "/contenttiers",
  "/contracts",
  "/currencies",
  "/events",
  "/gamemodes",
  "/gear",
  "/levelborders",
  "/maps",
  "/playercards",
  "/playertitles",
  "/seasons",
  "/sprays",
  "/themes",
  "/weapons",
  "/version",
].map(e => `${baseUrl}${versionRoute}${e}`);

console.log("=> Generating endpoints templates...");
const data = await Promise.all(
  ENDPOINTS.map(async url => ({
    url,
    name: guessEndpointName(url),
    filepath: getFilePath(ENDPOINTS_DIR, url),
    template: await generateEndpointTemplate(url),
  }))
);
console.log(" ✓ Done!\n");

console.log("=> Writing template to files...");
await Promise.all(
  data.map(async d => {
    await writeFile(d.filepath, d.template)
      .then(() => console.log(` - Written to ${d.filepath}`))
      .catch(e => {
        console.log(` - Error writing to file ${d.filepath}`);
        console.error(" - Error:", e.message);
      });
  })
);
console.log(" ✓ Done!\n");

console.log(`=> Writing additional files...`);
await writeFile(
  join(ENDPOINTS_DIR, "endpoints.ts"),
  AUTO_GEN_HEADER +
    getEndpointImports(data) +
    NEXTLINE +
    getEndpointsExport(data) +
    NEXTLINE +
    javascript`export type Endpoints = keyof typeof endpoints;`
)
  .then(() =>
    console.log(` - Written to ${join(ENDPOINTS_DIR, "endpoints.ts")}`)
  )
  .catch(e => {
    console.log(
      ` - Error writing to file ${join(ENDPOINTS_DIR, "endpoints.ts")}`
    );
    console.error(" - Error:", e.message);
  });

await writeFile(
  join(ENDPOINTS_DIR, "index.ts"),
  AUTO_GEN_HEADER +
    data.map(({ name }) => javascript`export * from "./${name}";`).join("\n") +
    NEXTLINE +
    javascript`export * from "./endpoints";`
)
  .then(() => console.log(` - Written to ${join(ENDPOINTS_DIR, "index.ts")}`))
  .catch(e => {
    console.log(` - Error writing to file ${join(ENDPOINTS_DIR, "index.ts")}`);
    console.error(" - Error:", e.message);
  });
console.log(" ✓ Done!\n");

console.log("=> Formatting files...");
await execa(`prettier --write ${ENDPOINTS_DIR}/*.ts`);
console.log(" ✓ Done!\n");

/* Helper Functions */

function getEndpointImports(data: { name: string }[]) {
  return data
    .map(
      ({ name }) =>
        javascript`import { ${capitalizeFirstLetter(
          name
        )}Endpoint } from "./${name}";`
    )
    .join("\n");
}

function getEndpointsExport(data: { name: string }[]) {
  return javascript`export const endpoints = {${data
    .map(({ name }) => `${name}: ${capitalizeFirstLetter(name)}Endpoint`)
    .join(",\n")}};
    `;
}
