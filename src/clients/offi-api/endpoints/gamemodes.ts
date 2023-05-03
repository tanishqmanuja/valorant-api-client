/* THIS IS AN AUTO GENERATED FILE - DO NOT EDIT */
import { z } from "zod";

import type { OffiApiEndpoint } from "~/clients/offi-api/types";

export const gameFeatureOverridesItemSchema = z.object({
  featureName: z.string(),
  state: z.boolean(),
});

export const gameRuleBoolOverridesItemSchema = z.object({
  ruleName: z.string(),
  state: z.boolean(),
});

export const gamemodesItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  duration: z.string().nullable(),
  allowsMatchTimeouts: z.boolean(),
  isTeamVoiceAllowed: z.boolean(),
  isMinimapHidden: z.boolean(),
  orbCount: z.number(),
  roundsPerHalf: z.number(),
  teamRoles: z.array(z.string()).nullable(),
  gameFeatureOverrides: z.array(gameFeatureOverridesItemSchema).nullable(),
  gameRuleBoolOverrides: z.array(gameRuleBoolOverridesItemSchema).nullable(),
  displayIcon: z.string().nullable(),
  assetPath: z.string(),
});

export const gamemodesSchema = z.array(gamemodesItemSchema);

export type Gamemodes = z.infer<typeof gamemodesSchema>;

export const GamemodesEndpoint = {
  url: "https://valorant-api.com/v1/gamemodes",
  schema: gamemodesSchema,
} as const satisfies OffiApiEndpoint;
