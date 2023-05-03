/* THIS IS AN AUTO GENERATED FILE - DO NOT EDIT */
import { z } from "zod";

import type { OffiApiEndpoint } from "~/clients/offi-api/types";

export const levelsItemSchema = z.object({
  uuid: z.string(),
  sprayLevel: z.number(),
  displayName: z.string(),
  displayIcon: z.string(),
  assetPath: z.string(),
});

export const spraysItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  category: z.string().nullable(),
  themeUuid: z.string().nullable(),
  displayIcon: z.string(),
  fullIcon: z.string().nullable(),
  fullTransparentIcon: z.string().nullable(),
  animationPng: z.string().nullable(),
  animationGif: z.string().nullable(),
  assetPath: z.string(),
  levels: z.array(levelsItemSchema),
});

export const spraysSchema = z.array(spraysItemSchema);

export type Sprays = z.infer<typeof spraysSchema>;

export const SpraysEndpoint = {
  url: "https://valorant-api.com/v1/sprays",
  schema: spraysSchema,
} as const satisfies OffiApiEndpoint;
