import { ValorantEndpoint } from "@tqman/valorant-api-types";

export * from "./templates";
export * from "./execa";

export const AUTO_GENERATED_HEADER = `/* THIS IS AN AUTOGENERATED FILE - DO NOT EDIT */\n\n`;

export type ValorantEndpoints = Record<string, ValorantEndpoint>;

export async function checkImport(importName: string) {
  const isImportAvailable = await import("@tqman/valorant-api-types")
    .then(m => Object.hasOwn(m, importName))
    .catch(() => false);
  return isImportAvailable;
}