import { z } from "zod";

import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Party Request",
  description: "Requests to join the specified party ID",
  type: "glz",
  method: "POST",
  url: "parties/v1/parties/:partyId/request",
  responses: {
    "200": z.unknown(), //TODO verify
  },
});
