import { z } from "zod";

import { playerUUIDSchema, pregameIDSchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Current Game Player",
  description: "Get the current game match ID for the provided player",
  type: "glz",
  url: "core-game/v1/players/:puuid",
  responses: {
    "200": z.object({
      Subject: playerUUIDSchema,
      MatchID: pregameIDSchema,
      Version: z.number(),
    }),
  },
});
