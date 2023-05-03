/* THIS IS AN AUTO GENERATED FILE - DO NOT EDIT */
import { z } from "zod";

import type { OffiApiEndpoint } from "~/clients/offi-api/types";

export const themesItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  displayIcon: z.string().nullable(),
  storeFeaturedImage: z.string().nullable(),
  assetPath: z.string(),
});

export const themesSchema = z.array(themesItemSchema);

export type Themes = z.infer<typeof themesSchema>;

export const ThemesEndpoint = {
  url: "https://valorant-api.com/v1/themes",
  schema: themesSchema,
} as const satisfies OffiApiEndpoint;
