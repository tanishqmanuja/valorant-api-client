import { z } from "zod";

import { loadoutsSchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "PreGame Loadouts",
  description: "Get Pre-Game loadout data",
  type: "glz",
  url: "pregame/v1/matches/:pregameMatchId/loadouts",
  responses: {
    "200": z.object({
      Loadouts: z.array(loadoutsSchema),
      LoadoutsValid: z.boolean(),
    }),
  },
});
