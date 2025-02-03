import { conversationsSchema } from "../common-types";
import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Pre-Game Chat Info",
  description: "Get information about the pre-game chat",
  type: "local",
  url: "chat/v6/conversations/ares-pregame",
  responses: {
    "200": conversationsSchema,
  },
});
