import { z } from "zod";

import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Send Friend Request",
  description:
    "Sends a friend request to a player. Can be used in conjunction with [GET Friend Requests] and [DELETE Remove Friend Request] to determine a player's PUUID from their game name.",
  type: "local",
  method: "POST",
  url: "chat/v4/friendrequests",
  body: z.object({
    game_name: z.string(),
    game_tag: z.string(),
  }),
  responses: {
    "200": z.object({
      requests: z.array(z.any()).length(0).describe("Empty array"),
    }),
  },
});
