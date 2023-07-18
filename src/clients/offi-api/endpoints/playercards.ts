import { z } from "zod";
import { type OffiApiEndpoint } from "~/clients/offi-api/types";

export const playercardsItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  isHiddenIfNotOwned: z.boolean(),
  themeUuid: z.string().nullable(),
  displayIcon: z.string(),
  smallArt: z.string(),
  wideArt: z.string(),
  largeArt: z.string(),
  assetPath: z.string(),
});

export const playercardsSchema = z.array(playercardsItemSchema);

export type Playercards = z.infer<typeof playercardsSchema>;

export const PlayercardsEndpoint = {
  url: "https://valorant-api.com/v1/playercards",
  schema: playercardsSchema,
} as const satisfies OffiApiEndpoint;
