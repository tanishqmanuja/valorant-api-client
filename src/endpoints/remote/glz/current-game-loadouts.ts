import { z } from "zod";

import { characterIDSchema, loadoutsSchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Current Game Loadouts",
  description: "Get the current game loadout info for all players in the match",
  type: "glz",
  url: "core-game/v1/matches/:currentGameMatchId/loadouts",
  responses: {
    "200": z.object({
      Loadouts: z.array(
        z.object({
          CharacterID: characterIDSchema,
          Loadout: loadoutsSchema,
        }),
      ),
    }),
  },
});
