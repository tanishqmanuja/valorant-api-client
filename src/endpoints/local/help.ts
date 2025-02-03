import { z } from "zod";

import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Help",
  description: "Get help for the local client",
  type: "local",
  url: "help",
  responses: {
    "200": z.object({
      events: z.record(
        z.string().describe("Websocket event name"),
        z.string().describe("Websocket event description"),
      ),
      functions: z.record(
        z.string().describe("Function name"),
        z.string().describe("Function description"),
      ),
      types: z.record(
        z.string().describe("Type name"),
        z.string().describe("Type description"),
      ),
    }),
  },
});
