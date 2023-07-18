import { z } from "zod";
import { type OffiApiEndpoint } from "~/clients/offi-api/types";

export const playertitlesItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string().nullable(),
  titleText: z.string().nullable(),
  isHiddenIfNotOwned: z.boolean(),
  assetPath: z.string(),
});

export const playertitlesSchema = z.array(playertitlesItemSchema);

export type Playertitles = z.infer<typeof playertitlesSchema>;

export const PlayertitlesEndpoint = {
  url: "https://valorant-api.com/v1/playertitles",
  schema: playertitlesSchema,
} as const satisfies OffiApiEndpoint;
