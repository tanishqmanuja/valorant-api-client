/* THIS IS AN AUTO GENERATED FILE - DO NOT EDIT */
import { z } from "zod";

import type { OffiApiEndpoint } from "~/clients/offi-api/types";

export const mapsLocationSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const mapsCalloutsItemSchema = z.object({
  regionName: z.string(),
  superRegionName: z.string(),
  location: mapsLocationSchema,
});

export const mapsItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  coordinates: z.string(),
  displayIcon: z.string().nullable(),
  listViewIcon: z.string(),
  splash: z.string(),
  assetPath: z.string(),
  mapUrl: z.string(),
  xMultiplier: z.number(),
  yMultiplier: z.number(),
  xScalarToAdd: z.number(),
  yScalarToAdd: z.number(),
  callouts: z.array(mapsCalloutsItemSchema).nullable(),
});

export const mapsSchema = z.array(mapsItemSchema);

export type Maps = z.infer<typeof mapsSchema>;

export const MapsEndpoint = {
  url: "https://valorant-api.com/v1/maps",
  schema: mapsSchema,
} as const satisfies OffiApiEndpoint;
