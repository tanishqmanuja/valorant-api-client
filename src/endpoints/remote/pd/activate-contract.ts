import { contractsResponse } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Activate Contract",
  description: "Activate a specific contract by ID",
  type: "pd",
  url: "contracts/v1/contracts/:puuid/special/:contractId",
  method: "POST",
  responses: {
    "200": contractsResponse,
  },
});
