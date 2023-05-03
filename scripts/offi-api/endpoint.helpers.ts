import { join } from "node:path";

export function guessEndpointName(url: string) {
  const parsedUrl = new URL(url);
  const name = parsedUrl.pathname.split("/").at(-1);

  if (!name) {
    throw Error("Could not guess endpoint name");
  }

  return name;
}

export function getFilePath(dir: string, url: string) {
  return join(dir, `${guessEndpointName(url)}.ts`);
}
