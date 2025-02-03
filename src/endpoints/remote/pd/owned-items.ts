import { z } from "zod";

import { itemIDSchema, weakUUIDSchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Owned Items",
  description: "List what the player owns (agents, skins, buddies, ect.)",
  type: "pd",
  url: "store/v1/entitlements/:puuid/:itemTypeId",
  responses: {
    "200": z.object({
      EntitlementsByTypes: z.array(
        z.object({
          ItemTypeID: z.string(),
          Entitlements: z.array(
            z.object({
              TypeID: weakUUIDSchema,
              ItemID: itemIDSchema,
              InstanceID: weakUUIDSchema.optional(),
            }),
          ),
        }),
      ),
    }),
  },
});
