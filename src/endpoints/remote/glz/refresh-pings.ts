import { partySchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Refresh Pings",
  description: "Refresh the pings of the specified player",
  type: "glz",
  method: "POST",
  url: "parties/v1/parties/:partyId/members/:puuid/refreshPings",
  responses: {
    "200": partySchema,
  },
});
