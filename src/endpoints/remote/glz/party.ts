import { partySchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Party",
  description: "Get the party information for the given party ID",
  queryName: "Party_FetchParty",
  category: "Party Endpoints",
  type: "glz",
  url: "parties/v1/parties/:partyId",
  responses: {
    "200": partySchema,
  },
});
