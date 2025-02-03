import { z } from "zod";

import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Party Remove Player",
  description: "Remove a player from the current party",
  type: "glz",
  url: "parties/v1/players/:puuid",
  method: "DELETE",
  responses: {
    "204": z.undefined(),
  },
});
