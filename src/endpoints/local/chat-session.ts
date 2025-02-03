import { z } from "zod";

import { playerUUIDSchema } from "../common-types";
import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Chat Session",
  description: "Get the current session including player name and PUUID",
  type: "local",
  url: "chat/v1/session",
  responses: {
    "200": z.object({
      federated: z.boolean(),
      game_name: z.string(),
      game_tag: z.string(),
      loaded: z.boolean(),
      name: z.string(),
      pid: z.string(),
      puuid: playerUUIDSchema,
      region: z.string(),
      resource: z.string(),
      state: z.string(),
    }),
  },
});
