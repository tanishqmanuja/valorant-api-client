import { z } from "zod";

import { playerUUIDSchema } from "../common-types";
import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Remove Friend Request",
  description: "Removes an outgoing friend request",
  type: "local",
  method: "DELETE",
  url: "chat/v4/friendrequests",
  body: z.object({
    puuid: playerUUIDSchema,
  }),
  responses: {
    "204": z.undefined(),
  },
});
