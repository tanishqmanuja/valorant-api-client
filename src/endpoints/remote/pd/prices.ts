import { z } from "zod";

import {
  currencyIDSchema,
  dateSchema,
  itemIDSchema,
  itemTypeIDSchema,
} from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Prices",
  description: "Get the current store prices for all items",
  type: "pd",
  url: "store/v1/offers/",
  responses: {
    "200": z.object({
      Offers: z.array(
        z.object({
          OfferID: z.string(),
          IsDirectPurchase: z.boolean(),
          StartDate: dateSchema,
          Cost: z.record(currencyIDSchema, z.number()),
          Rewards: z.array(
            z.object({
              ItemTypeID: itemTypeIDSchema,
              ItemID: itemIDSchema,
              Quantity: z.number(),
            }),
          ),
        }),
      ),
    }),
  },
});
