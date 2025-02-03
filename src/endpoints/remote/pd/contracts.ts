import { contractsResponse } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Contracts",
  description:
    "Get contract details including agents, battlepass, missions, and recent games",
  type: "pd",
  url: "contracts/v1/contracts/:puuid",
  responses: {
    "200": contractsResponse,
  },
});
