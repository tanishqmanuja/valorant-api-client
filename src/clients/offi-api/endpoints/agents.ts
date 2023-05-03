/* THIS IS AN AUTO GENERATED FILE - DO NOT EDIT */
import { z } from "zod";

import type { OffiApiEndpoint } from "~/clients/offi-api/types";

export const roleSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  description: z.string(),
  displayIcon: z.string(),
  assetPath: z.string(),
});

export const abilitiesItemSchema = z.object({
  slot: z.string(),
  displayName: z.string(),
  description: z.string(),
  displayIcon: z.string().nullable(),
});

export const mediaListItemSchema = z.object({
  id: z.number(),
  wwise: z.string(),
  wave: z.string(),
});

export const voiceLineSchema = z.object({
  minDuration: z.number(),
  maxDuration: z.number(),
  mediaList: z.array(mediaListItemSchema),
});

export const agentsItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  description: z.string(),
  developerName: z.string(),
  characterTags: z.array(z.string()).nullable(),
  displayIcon: z.string(),
  displayIconSmall: z.string(),
  bustPortrait: z.string(),
  fullPortrait: z.string(),
  fullPortraitV2: z.string(),
  killfeedPortrait: z.string(),
  background: z.string(),
  backgroundGradientColors: z.array(z.string()),
  assetPath: z.string(),
  isFullPortraitRightFacing: z.boolean(),
  isPlayableCharacter: z.boolean(),
  isAvailableForTest: z.boolean(),
  isBaseContent: z.boolean(),
  role: roleSchema,
  abilities: z.array(abilitiesItemSchema),
  voiceLine: voiceLineSchema,
});

export const agentsSchema = z.array(agentsItemSchema);

export type Agents = z.infer<typeof agentsSchema>;

export const AgentsEndpoint = {
  url: "https://valorant-api.com/v1/agents?isPlayableCharacter=true",
  schema: agentsSchema,
} as const satisfies OffiApiEndpoint;
