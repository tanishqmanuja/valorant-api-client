import { z } from "zod";

import {
  currencyIDSchema,
  itemIDSchema,
  itemTypeIDSchema,
  weakUUIDSchema,
} from "../../common-types";
import { defineEndpoint } from "../../schema";

const itemSchema = z.object({
  ItemTypeID: itemTypeIDSchema,
  ItemID: itemIDSchema,
});
const rewardSchema = z.object({ Amount: z.number() }).merge(itemSchema);

export default defineEndpoint({
  name: "Item Upgrades",
  description: "Get details for item upgrades",
  type: "pd",
  url: "contract-definitions/v3/item-upgrades",
  responses: {
    "200": z.object({
      Definitions: z.array(
        z.object({
          ID: weakUUIDSchema,
          Item: itemSchema,
          RequiredEntitlement: itemSchema,
          ProgressionSchedule: z.object({
            Name: z.string(),
            ProgressionCurrencyID: currencyIDSchema,
            ProgressionDeltaPerLevel: z.array(z.number()).nullable(),
          }),
          RewardSchedule: z.object({
            ID: weakUUIDSchema,
            Name: z.string(),
            Prerequisites: z.null(),
            RewardsPerLevel: z
              .array(
                z.object({
                  EntitlementRewards: z.array(rewardSchema),
                  WalletRewards: z.null(),
                  CounterRewards: z.null(),
                }),
              )
              .nullable(),
          }),
          Sidegrades: z
            .array(
              z.object({
                SidegradeID: weakUUIDSchema,
                Options: z.array(
                  z.object({
                    OptionID: weakUUIDSchema,
                    Cost: z.object({
                      WalletCosts: z.array(
                        z.object({
                          CurrencyID: currencyIDSchema,
                          AmountToDeduct: z.number(),
                        }),
                      ),
                    }),
                    Rewards: z.array(rewardSchema),
                  }),
                ),
                Prerequisites: z.object({
                  RequiredEntitlements: z.array(itemSchema),
                }),
              }),
            )
            .nullable(),
        }),
      ),
    }),
  },
});
