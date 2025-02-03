import { z } from "zod";

import { millisSchema, playerUUIDSchema } from "../common-types";
import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Friends",
  description: "Get a list of friends",
  type: "local",
  url: "chat/v4/friends",
  responses: {
    "200": z.object({
      friends: z.array(
        z.object({
          activePlatform: z.string().nullable(),
          displayGroup: z.string(),
          game_name: z.string(),
          game_tag: z.string(),
          group: z.string(),
          last_online_ts: millisSchema.nullable(),
          name: z.string(),
          note: z.string(),
          pid: z.string(),
          puuid: playerUUIDSchema,
          region: z.string(),
        }),
      ),
    }),
  },
});
