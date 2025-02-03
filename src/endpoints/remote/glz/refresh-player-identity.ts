import { partySchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Refresh Player Identity",
  description: "Refresh the identity of the specified player",
  type: "glz",
  method: "POST",
  url: "parties/v1/parties/:partyId/members/:puuid/refreshPlayerIdentity",
  responses: {
    "200": partySchema,
  },
});
