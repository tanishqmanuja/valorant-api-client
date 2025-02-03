import { z } from "zod";

import { playerUUIDSchema } from "../common-types";
import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Chat Participants",
  description:
    "Get information about the participants of all active conversations or a specific conversation if a cid is provided",
  type: "local",
  url: "chat/v5/participants",
  query: z.object({ cid: z.string().optional() }),
  responses: {
    "200": z.object({
      participants: z.array(
        z.object({
          activePlatform: z.null(),
          cid: z.string(),
          game_name: z.string(),
          game_tag: z.string(),
          muted: z.boolean(),
          name: z.string(),
          pid: z.string(),
          puuid: playerUUIDSchema,
          region: z.string(),
        }),
      ),
    }),
  },
});
