import { z } from "zod";

import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Entitlements Token",
  description: "Get entitlement for remote requests with a token",
  type: "auth",
  method: "POST",
  url: "https://entitlements.auth.riotgames.com/api/token/v1",
  requirements: ["ACCESS_TOKEN"],
  headers: {
    "Content-Type": "application/json",
  },
  responses: {
    "200": z.object({
      entitlements_token: z.string(),
    }),
  },
});
