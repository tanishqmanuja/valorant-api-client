import { z } from "zod";
import { type OffiApiEndpoint } from "~/clients/offi-api/types";

export const versionSchema = z.object({
  manifestId: z.string(),
  branch: z.string(),
  version: z.string(),
  buildVersion: z.string(),
  engineVersion: z.string(),
  riotClientVersion: z.string(),
  riotClientBuild: z.string(),
  buildDate: z.string(),
});

export type Version = z.infer<typeof versionSchema>;

export const VersionEndpoint = {
  url: "https://valorant-api.com/v1/version",
  schema: versionSchema,
} as const satisfies OffiApiEndpoint;
