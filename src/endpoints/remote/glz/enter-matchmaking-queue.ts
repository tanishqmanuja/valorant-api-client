import { partySchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Enter Matchmaking Queue",
  description: "Enter the matchmaking queue for the party",
  type: "glz",
  method: "POST",
  url: "parties/v1/parties/:partyId/matchmaking/join",
  responses: {
    "200": partySchema,
  },
});
