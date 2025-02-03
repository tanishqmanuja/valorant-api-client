import { partySchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Party Invite",
  description: "Invite a player to the party by name and tagline",
  type: "glz",
  method: "POST",
  url: "parties/v1/parties/:partyId/invites/name/:name/tag/:tagline",
  responses: {
    "200": partySchema,
  },
});
