/* THIS IS AN AUTO GENERATED FILE - DO NOT EDIT */
import { z } from "zod";

import type { OffiApiEndpoint } from "~/clients/offi-api/types";

export const buddiesLevelsItemSchema = z.object({
  uuid: z.string(),
  charmLevel: z.number(),
  displayName: z.string(),
  displayIcon: z.string(),
  assetPath: z.string(),
});

export const buddiesItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  isHiddenIfNotOwned: z.boolean(),
  themeUuid: z.string().nullable(),
  displayIcon: z.string(),
  assetPath: z.string(),
  levels: z.array(buddiesLevelsItemSchema),
});

export const buddiesSchema = z.array(buddiesItemSchema);

export type Buddies = z.infer<typeof buddiesSchema>;

export const BuddiesEndpoint = {
  url: "https://valorant-api.com/v1/buddies",
  schema: buddiesSchema,
} as const satisfies OffiApiEndpoint;
