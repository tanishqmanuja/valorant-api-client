import { conversationsSchema } from "../common-types";
import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Current Game Chat Info",
  description: "Get information about the current game chat",
  type: "local",
  url: "chat/v6/conversations/ares-coregame",
  responses: {
    "200": conversationsSchema,
  },
});
