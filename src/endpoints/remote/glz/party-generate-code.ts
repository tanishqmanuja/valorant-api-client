import { partySchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Party Generate Code",
  description: "Generate a party invite code",
  type: "glz",
  method: "POST",
  url: "parties/v1/parties/:partyId/invitecode",
  responses: {
    "200": partySchema,
  },
});
