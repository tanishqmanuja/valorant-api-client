/* THIS IS AN AUTO GENERATED FILE - DO NOT EDIT */
import { z } from "zod";

import type { OffiApiEndpoint } from "~/clients/offi-api/types";

export const contenttiersItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  devName: z.string(),
  rank: z.number(),
  juiceValue: z.number(),
  juiceCost: z.number(),
  highlightColor: z.string(),
  displayIcon: z.string(),
  assetPath: z.string(),
});

export const contenttiersSchema = z.array(contenttiersItemSchema);

export type Contenttiers = z.infer<typeof contenttiersSchema>;

export const ContenttiersEndpoint = {
  url: "https://valorant-api.com/v1/contenttiers",
  schema: contenttiersSchema,
} as const satisfies OffiApiEndpoint;
