import { z } from "zod";

import {
  currencyIDSchema,
  itemIDSchema,
  itemTypeIDSchema,
  offerSchema,
  weakUUIDSchema,
} from "../../common-types";
import { defineEndpoint } from "../../schema";

const bundleSchema = z.object({
  ID: weakUUIDSchema,
  DataAssetID: weakUUIDSchema,
  CurrencyID: currencyIDSchema,
  Items: z.array(
    z.object({
      Item: z.object({
        ItemTypeID: itemTypeIDSchema,
        ItemID: itemIDSchema,
        Amount: z.number(),
      }),
      BasePrice: z.number(),
      CurrencyID: currencyIDSchema,
      DiscountPercent: z.number(),
      DiscountedPrice: z.number(),
      IsPromoItem: z.boolean(),
    }),
  ),
  ItemOffers: z
    .array(
      z.object({
        BundleItemOfferID: weakUUIDSchema,
        Offer: offerSchema,
        DiscountPercent: z.number(),
        DiscountedCost: z.record(weakUUIDSchema, z.number()),
      }),
    )
    .nullable(),
  TotalBaseCost: z.record(weakUUIDSchema, z.number()).nullable(),
  TotalDiscountedCost: z.record(weakUUIDSchema, z.number()).nullable(),
  TotalDiscountPercent: z.number(),
  DurationRemainingInSeconds: z.number(),
  WholesaleOnly: z.boolean(),
});

const bonusOfferSchema = z.object({
  BonusOfferID: weakUUIDSchema,
  Offer: offerSchema,
  DiscountPercent: z.number(),
  DiscountCosts: z.record(weakUUIDSchema, z.number()),
  IsSeen: z.boolean(),
});

export default defineEndpoint({
  name: "Storefront",
  description: "Get the currently available items in the store",
  type: "pd",
  url: "store/v2/storefront/:puuid",
  responses: {
    "200": z.object({
      FeaturedBundle: z.object({
        Bundle: bundleSchema,
        Bundles: z.array(bundleSchema),
        BundleRemainingDurationInSeconds: z.number(),
      }),
      SkinsPanelLayout: z.object({
        SingleItemOffers: z.array(itemIDSchema),
        SingleItemStoreOffers: z.array(offerSchema),
        SingleItemOffersRemainingDurationInSeconds: z.number(),
      }),
      UpgradeCurrencyStore: z.object({
        UpgradeCurrencyOffers: z.array(
          z.object({
            OfferID: weakUUIDSchema,
            StorefrontItemID: itemIDSchema,
            Offer: offerSchema,
            DiscountedPercent: z.number(),
          }),
        ),
      }),
      AccessoryStore: z.object({
        AccessoryStoreOffers: z.array(
          z.object({
            Offer: offerSchema,
            ContractID: weakUUIDSchema,
          }),
        ),
        AccessoryStoreRemainingDurationInSeconds: z.number(),
        StorefrontID: weakUUIDSchema,
      }),
      BonusStore: z
        .object({
          BonusStoreOffers: z.array(bonusOfferSchema),
          BonusStoreRemainingDurationInSeconds: z.number(),
        })
        .optional()
        .describe("Night market"),
    }),
  },
});
