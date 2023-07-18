import { execa } from "../helpers/execa";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { AUTO_GENERATED_HEADER } from "../helpers";
import { paramCase } from "change-case";
import {
  tOffiEndpoint,
  tOffiEndpointsBarrel,
  tOffiEndpointsWrapper,
} from "./templates/offi.template";

const ENDPOINTS_DIR = "src/clients/offi-api/endpoints";
await mkdir(ENDPOINTS_DIR, { recursive: true });

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
  ENDPOINTS.map(async url => {
    const name = guessEndpointName(url);
    return {
      name,
      filepath: getFilePath(ENDPOINTS_DIR, url),
      template: await tOffiEndpoint({
        url,
        name,
      }),
    };
  }),
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
  }),
);
console.log(" ✓ Done!\n");

console.log(`=> Writing additional files...`);
await writeFile(
  join(ENDPOINTS_DIR, "endpoints.ts"),
  AUTO_GENERATED_HEADER + tOffiEndpointsWrapper(data),
)
  .then(() =>
    console.log(` - Written to ${join(ENDPOINTS_DIR, "endpoints.ts")}`),
  )
  .catch(e => {
    console.log(
      ` - Error writing to file ${join(ENDPOINTS_DIR, "endpoints.ts")}`,
    );
    console.error(" - Error:", e.message);
  });

await writeFile(
  join(ENDPOINTS_DIR, "index.ts"),
  AUTO_GENERATED_HEADER + tOffiEndpointsBarrel(data),
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

export function guessEndpointName(url: string) {
  const parsedUrl = new URL(url);
  const name = parsedUrl.pathname.split("/").at(-1);

  if (!name) {
    throw Error("Could not guess endpoint name");
  }

  return name;
}

export function getFilePath(dir: string, url: string) {
  return join(dir, `${paramCase(guessEndpointName(url))}.ts`);
}
