import { z } from "zod";

import { partySchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Party Set Member Ready",
  description: "Set the ready status of a player in the current party",
  type: "glz",
  url: "parties/v1/parties/:partyId/members/:puuid/setReady",
  method: "POST",
  body: z.object({
    ready: z.boolean().describe("Ready Status"),
  }),
  responses: {
    "200": partySchema,
  },
});
