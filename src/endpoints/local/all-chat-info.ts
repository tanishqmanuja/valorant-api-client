import { conversationsSchema } from "../common-types";
import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "All Chat Info",
  description: "Get information about all active conversations",
  type: "local",
  url: "chat/v6/conversations",
  responses: {
    "200": conversationsSchema,
  },
});
