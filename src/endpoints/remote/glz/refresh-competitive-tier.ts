import { partySchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Refresh Competitive Tier",
  description: "Refresh the competitive tier of the specified player",
  type: "glz",
  method: "POST",
  url: "parties/v1/parties/:partyId/members/:puuid/refreshCompetitiveTier",
  responses: {
    "200": partySchema,
  },
});
