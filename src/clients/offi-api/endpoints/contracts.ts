/* THIS IS AN AUTO GENERATED FILE - DO NOT EDIT */
import { z } from "zod";

import type { OffiApiEndpoint } from "~/clients/offi-api/types";

export const rewardSchema = z.object({
  type: z.string(),
  uuid: z.string(),
  amount: z.number(),
  isHighlighted: z.boolean(),
});

export const freeRewardsItemSchema = z.object({
  type: z.string(),
  uuid: z.string(),
  amount: z.number(),
  isHighlighted: z.boolean(),
});

export const levelsItemSchema = z.object({
  reward: rewardSchema,
  xp: z.number(),
  vpCost: z.number(),
  isPurchasableWithVP: z.boolean(),
  doughCost: z.number(),
  isPurchasableWithDough: z.boolean(),
});

export const chaptersItemSchema = z.object({
  isEpilogue: z.boolean(),
  levels: z.array(levelsItemSchema),
  freeRewards: z.array(freeRewardsItemSchema).nullable(),
});

export const contentSchema = z.object({
  relationType: z.string().nullable(),
  relationUuid: z.string().nullable(),
  chapters: z.array(chaptersItemSchema),
  premiumRewardScheduleUuid: z.string().nullable(),
  premiumVPCost: z.number(),
});

export const contractsItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  displayIcon: z.string().nullable(),
  shipIt: z.boolean(),
  freeRewardScheduleUuid: z.string(),
  content: contentSchema,
  assetPath: z.string(),
});

export const contractsSchema = z.array(contractsItemSchema);

export type Contracts = z.infer<typeof contractsSchema>;

export const ContractsEndpoint = {
  url: "https://valorant-api.com/v1/contracts",
  schema: contractsSchema,
} as const satisfies OffiApiEndpoint;
