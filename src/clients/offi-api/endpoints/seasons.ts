import { z } from "zod";
import { type OffiApiEndpoint } from "~/clients/offi-api/types";

export const seasonsItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  type: z.string().nullable(),
  startTime: z.string(),
  endTime: z.string(),
  parentUuid: z.string().nullable(),
  assetPath: z.string(),
});

export const seasonsSchema = z.array(seasonsItemSchema);

export type Seasons = z.infer<typeof seasonsSchema>;

export const SeasonsEndpoint = {
  url: "https://valorant-api.com/v1/seasons",
  schema: seasonsSchema,
} as const satisfies OffiApiEndpoint;
