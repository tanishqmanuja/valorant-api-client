import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { z } from "zod";

import { splitByLine } from "~/utils/text";

export const LOG_FILE_PATH = join(
  process.env.LOCALAPPDATA ?? "",
  "VALORANT",
  "Saved",
  "Logs",
  "ShooterGame.log",
);

export type LogfileData = {
  clientVersion: string;
  servers: {
    glz: string;
    pd: string;
    shared: string;
  };
};

function parseClientVersion(lines: string[]): string {
  const found = lines.find((line) => line.includes("CI server version:"));

  if (!found) {
    throw Error("CI server version line not found");
  }

  const match = found.match(
    /CI server version: (?<buildType>.*)-(?<patch>.*)-(?<buildVersion>.*)-(?<changelist>.*)/,
  );

  const data = z
    .object({
      buildType: z.string(),
      patch: z.string(),
      buildVersion: z.string(),
      changelist: z.string(),
    })
    .parse(match?.groups);

  return `${data.buildType}-${data.patch}-shipping-${data.buildVersion}-${data.changelist}`;
}

function parseServer(lines: string[], type: string): string {
  const found = lines.find(
    (line) => line.includes(`https://${type}`) && line.includes(".a.pvp.net/"),
  );

  if (!found) {
    throw Error(`Server ${type} not found`);
  }

  const match = found.match(RegExp(`https:\/\/${type}.*?\.a\.pvp\.net`));

  if (!match?.[0]) {
    throw Error(`Parsing error for server ${type}`);
  }

  return match[0];
}

export async function getLogFileData(
  path: string = LOG_FILE_PATH,
): Promise<LogfileData> {
  return readFile(path, "utf8")
    .then(splitByLine)
    .then((content) => {
      return {
        clientVersion: parseClientVersion(content),
        servers: {
          glz: parseServer(content, "glz"),
          pd: parseServer(content, "pd"),
          shared: parseServer(content, "shared"),
        },
      };
    });
}
