import { z } from "zod";

import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "PreGame Quit",
  description: "Quit the pre-game lobby",
  type: "glz",
  method: "POST",
  url: "pregame/v1/matches/:pregameMatchId/quit",
  responses: {
    "204": z.undefined(),
  },
});
