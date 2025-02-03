import { partySchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Start Custom Game",
  description: "Start a custom game",
  type: "glz",
  method: "POST",
  url: "parties/v1/parties/:partyId/startcustomgame",
  responses: {
    "200": partySchema,
  },
});
