import { partySchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Party Decline",
  description: "Decline a party invite request",
  type: "glz",
  method: "POST",
  url: "parties/v1/parties/:partyId/request/:requestId/decline",
  responses: {
    "200": partySchema,
  },
});
