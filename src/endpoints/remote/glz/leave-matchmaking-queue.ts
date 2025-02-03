import { partySchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Leave Matchmaking Queue",
  description: "Leave the matchmaking queue for the party",
  type: "glz",
  method: "POST",
  url: "parties/v1/parties/:partyId/matchmaking/leave",
  responses: {
    "200": partySchema,
  },
});
