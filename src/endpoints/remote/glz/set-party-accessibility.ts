import { z } from "zod";

import { partySchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Set Party Accessibility",
  description: "Set the accessibility of the party",
  type: "glz",
  method: "POST",
  url: "parties/v1/parties/:partyId/accessibility",
  body: z.object({
    accessibility: z.enum(["OPEN", "CLOSED"]),
  }),
  responses: {
    "200": partySchema,
  },
});
