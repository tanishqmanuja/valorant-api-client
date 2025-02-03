import { z } from "zod";

import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "MultiFactor Authentication",
  description: "Submits a multi-factor authentication code for login",
  type: "auth",
  method: "PUT",
  url: "https://auth.riotgames.com/api/v1/authorization",
  headers: {
    "Content-Type": "application/json",
  },
  body: z.object({
    type: z.literal("multifactor"),
    multifactor: z.object({
      otp: z.string().describe("The multi-factor authentication code"),
      rememberDevice: z.boolean(),
    }),
  }),
});
