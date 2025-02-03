import { z } from "zod";

import { chatMessagesSchema } from "../common-types";
import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Chat History",
  description:
    "Get chat history for all conversations or a specific conversation if the cid is provided",
  type: "local",
  url: "chat/v6/messages",
  query: z.object({ cid: z.string().optional() }),
  responses: {
    "200": chatMessagesSchema,
  },
});
