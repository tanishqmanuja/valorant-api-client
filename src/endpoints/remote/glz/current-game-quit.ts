import { z } from "zod";

import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Current Game Quit",
  description: "Quits the current game",
  type: "glz",
  method: "POST",
  url: "core-game/v1/players/:puuid/disassociate/:currentGameMatchId",
  responses: {
    "204": z.undefined(),
  },
});
