import { z } from "zod";
import { type OffiApiEndpoint } from "~/clients/offi-api/types";

export const bundlesItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  displayNameSubText: z.string().nullable(),
  description: z.string(),
  extraDescription: z.string().nullable(),
  promoDescription: z.string().nullable(),
  useAdditionalContext: z.boolean(),
  displayIcon: z.string(),
  displayIcon2: z.string(),
  verticalPromoImage: z.string().nullable(),
  assetPath: z.string(),
});

export const bundlesSchema = z.array(bundlesItemSchema);

export type Bundles = z.infer<typeof bundlesSchema>;

export const BundlesEndpoint = {
  url: "https://valorant-api.com/v1/bundles",
  schema: bundlesSchema,
} as const satisfies OffiApiEndpoint;
