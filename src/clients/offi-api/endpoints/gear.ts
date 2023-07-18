import { z } from "zod";
import { type OffiApiEndpoint } from "~/clients/offi-api/types";

export const gearShopDataSchema = z.object({
  cost: z.number(),
  category: z.string(),
  categoryText: z.string(),
  gridPosition: z.null(),
  canBeTrashed: z.boolean(),
  image: z.null(),
  newImage: z.string(),
  newImage2: z.null(),
  assetPath: z.string(),
});

export const gearItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  description: z.string(),
  displayIcon: z.string(),
  assetPath: z.string(),
  shopData: gearShopDataSchema,
});

export const gearSchema = z.array(gearItemSchema);

export type Gear = z.infer<typeof gearSchema>;

export const GearEndpoint = {
  url: "https://valorant-api.com/v1/gear",
  schema: gearSchema,
} as const satisfies OffiApiEndpoint;
