import { pregameMatchSchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "PreGame Match",
  description: "Get Pre-Game match data",
  type: "glz",
  url: "pregame/v1/matches/:pregameMatchId",
  responses: {
    "200": pregameMatchSchema,
  },
});
