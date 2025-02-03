import { pregameMatchSchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Lock Character",
  description: [
    "Lock in an agent",
    "DO NOT USE THIS FOR INSTALOCKING",
    "Riot doesn't like this. You may get banned or get the API restricted for the rest of us",
  ].join("\n"),
  type: "glz",
  method: "POST",
  url: "pregame/v1/matches/:pregameMatchId/lock/:agentId",
  responses: {
    "200": pregameMatchSchema,
  },
});
