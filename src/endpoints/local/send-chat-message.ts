import { z } from "zod";

import { chatMessagesSchema } from "../common-types";
import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Send Chat Message",
  description: "Send a message to the specified group",
  type: "local",
  url: "chat/v6/messages",
  method: "POST",
  body: z.object({
    cid: z
      .string()
      .describe("The conversation ID of the group to send the message to"),
    message: z.string(),
    type: z
      .enum(["groupchat", "chat", "system"])
      .describe(
        "Use `chat` for whispers, `groupchat` for group messages, and `system` for system messages",
      ),
  }),
  riotRequirements: {
    localAuth: true,
  },
  responses: {
    "200": chatMessagesSchema,
  },
});
