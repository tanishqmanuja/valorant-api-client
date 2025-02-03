import { conversationsSchema } from "../common-types";
import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Party Chat Info",
  description: "Get information about the party chat",
  type: "local",
  url: "chat/v6/conversations/ares-parties",
  responses: {
    "200": conversationsSchema,
  },
});
