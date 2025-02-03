import { z } from "zod";

import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Auth Cookies",
  description: "Prepare cookies for auth request",
  type: "auth",
  method: "POST",
  url: "https://auth.riotgames.com/api/v1/authorization",
  headers: {
    "Content-Type": "application/json",
  },
  body: z.object({
    client_id: z.literal("play-valorant-web-prod"),
    nonce: z.literal("1"),
    redirect_uri: z.literal("https://playvalorant.com/opt_in"),
    response_type: z.literal("token id_token"),
    scope: z.literal("account openid"),
  }),
});
