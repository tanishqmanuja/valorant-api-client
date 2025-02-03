import { z } from "zod";

import { currencyIDSchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Wallet",
  description: "Get the current wallet balance for the user",
  type: "pd",
  url: "store/v1/wallet/:puuid",
  responses: {
    "200": z.object({
      Balances: z.record(currencyIDSchema, z.number()),
    }),
  },
});
