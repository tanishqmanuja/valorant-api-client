import { partyPlayerSchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Party Player",
  description: "Get the party information for the given player",
  type: "glz",
  url: "parties/v1/players/:puuid",
  responses: {
    "200": partyPlayerSchema,
  },
});
