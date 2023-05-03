/* THIS IS AN AUTO GENERATED FILE - DO NOT EDIT */
import { z } from "zod";

import type { OffiApiEndpoint } from "~/clients/offi-api/types";

export const contractsRewardSchema = z.object({
  type: z.string(),
  uuid: z.string(),
  amount: z.number(),
  isHighlighted: z.boolean(),
});

export const contractsFreeRewardsItemSchema = z.object({
  type: z.string(),
  uuid: z.string(),
  amount: z.number(),
  isHighlighted: z.boolean(),
});

export const contractsLevelsItemSchema = z.object({
  reward: contractsRewardSchema,
  xp: z.number(),
  vpCost: z.number(),
  isPurchasableWithVP: z.boolean(),
  doughCost: z.number(),
  isPurchasableWithDough: z.boolean(),
});

export const contractsChaptersItemSchema = z.object({
  isEpilogue: z.boolean(),
  levels: z.array(contractsLevelsItemSchema),
  freeRewards: z.array(contractsFreeRewardsItemSchema).nullable(),
});

export const contractsContentSchema = z.object({
  relationType: z.string().nullable(),
  relationUuid: z.string().nullable(),
  chapters: z.array(contractsChaptersItemSchema),
  premiumRewardScheduleUuid: z.string().nullable(),
  premiumVPCost: z.number(),
});

export const contractsItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  displayIcon: z.string().nullable(),
  shipIt: z.boolean(),
  freeRewardScheduleUuid: z.string(),
  content: contractsContentSchema,
  assetPath: z.string(),
});

export const contractsSchema = z.array(contractsItemSchema);

export type Contracts = z.infer<typeof contractsSchema>;

export const ContractsEndpoint = {
  url: "https://valorant-api.com/v1/contracts",
  schema: contractsSchema,
} as const satisfies OffiApiEndpoint;
