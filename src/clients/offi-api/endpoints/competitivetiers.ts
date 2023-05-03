/* THIS IS AN AUTO GENERATED FILE - DO NOT EDIT */
import { z } from "zod";

import type { OffiApiEndpoint } from "~/clients/offi-api/types";

export const competitivetiersTiersItemSchema = z.object({
  tier: z.number(),
  tierName: z.string(),
  division: z.string(),
  divisionName: z.string(),
  color: z.string(),
  backgroundColor: z.string(),
  smallIcon: z.string().nullable(),
  largeIcon: z.string().nullable(),
  rankTriangleDownIcon: z.string().nullable(),
  rankTriangleUpIcon: z.string().nullable(),
});

export const competitivetiersItemSchema = z.object({
  uuid: z.string(),
  assetObjectName: z.string(),
  tiers: z.array(competitivetiersTiersItemSchema),
  assetPath: z.string(),
});

export const competitivetiersSchema = z.array(competitivetiersItemSchema);

export type Competitivetiers = z.infer<typeof competitivetiersSchema>;

export const CompetitivetiersEndpoint = {
  url: "https://valorant-api.com/v1/competitivetiers",
  schema: competitivetiersSchema,
} as const satisfies OffiApiEndpoint;
