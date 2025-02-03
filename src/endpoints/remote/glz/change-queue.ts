import { z } from "zod";

import { partySchema, queueIDSchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Change Queue",
  description: "Change the queue for the party",
  type: "glz",
  method: "POST",
  url: "parties/v1/parties/:partyId/queue",
  body: z.object({
    queueId: queueIDSchema,
  }),
  responses: {
    "200": partySchema,
  },
});
