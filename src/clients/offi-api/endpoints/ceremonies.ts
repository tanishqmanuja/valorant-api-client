/* THIS IS AN AUTO GENERATED FILE - DO NOT EDIT */
import { z } from "zod";

import type { OffiApiEndpoint } from "~/clients/offi-api/types";

export const ceremoniesItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  assetPath: z.string(),
});

export const ceremoniesSchema = z.array(ceremoniesItemSchema);

export type Ceremonies = z.infer<typeof ceremoniesSchema>;

export const CeremoniesEndpoint = {
  url: "https://valorant-api.com/v1/ceremonies",
  schema: ceremoniesSchema,
} as const satisfies OffiApiEndpoint;
