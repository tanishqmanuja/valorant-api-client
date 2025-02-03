import { z } from "zod";

import { playerUUIDSchema } from "../common-types";
import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Friend Requests",
  description: "Get a list of friend requests",
  type: "local",
  url: "chat/v4/friendrequests",
  responses: {
    "200": z.object({
      requests: z.array(
        z.object({
          game_name: z.string(),
          game_tag: z.string(),
          name: z.string(),
          note: z.string(),
          pid: z.string(),
          puuid: playerUUIDSchema,
          region: z.string(),
          subscription: z.enum(["pending_out", "pending_in"]),
        }),
      ),
    }),
  },
});
