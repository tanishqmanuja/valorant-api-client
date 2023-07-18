import { z } from "zod";
import { type OffiApiEndpoint } from "~/clients/offi-api/types";

export const levelbordersItemSchema = z.object({
  uuid: z.string(),
  startingLevel: z.number(),
  levelNumberAppearance: z.string(),
  smallPlayerCardAppearance: z.string(),
  assetPath: z.string(),
});

export const levelbordersSchema = z.array(levelbordersItemSchema);

export type Levelborders = z.infer<typeof levelbordersSchema>;

export const LevelbordersEndpoint = {
  url: "https://valorant-api.com/v1/levelborders",
  schema: levelbordersSchema,
} as const satisfies OffiApiEndpoint;
