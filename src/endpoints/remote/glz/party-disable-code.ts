import { partySchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Party Disable Code",
  description: "Disable the party invite code",
  type: "glz",
  method: "DELETE",
  url: "parties/v1/parties/:partyId/invitecode",
  responses: {
    "200": partySchema,
  },
});
