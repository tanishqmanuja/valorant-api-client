import { z } from "zod";

import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Party Chat Token",
  description: "Get the party chat token",
  type: "glz",
  url: "parties/v1/parties/:partyId/muctoken",
  responses: {
    "200": z.object({
      Token: z.string(),
      Room: z.string(),
    }),
  },
});
