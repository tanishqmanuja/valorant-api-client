import { z } from "zod";

import { millisSchema } from "../common-types";
import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Account Alias",
  description: "Gets the player username and tagline",
  type: "local",
  url: "player-account/aliases/v1/active",
  responses: {
    "200": z.object({
      active: z.boolean(),
      created_datetime: millisSchema,
      game_name: z.string(),
      summoner: z.boolean(),
      tag_line: z.string(),
    }),
  },
});
