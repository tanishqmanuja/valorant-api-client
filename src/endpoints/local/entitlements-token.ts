import { z } from "zod";

import { playerUUIDSchema } from "../common-types";
import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Entitlements Token",
  description: [
    "Gets both the token and entitlement for API usage",
    "",
    "`accessToken` is used as the token and `token` is used as the entitlement.",
  ].join(" \n"),
  type: "local",
  url: "entitlements/v1/token",
  responses: {
    "200": z.object({
      accessToken: z.string().describe("Used as the token in requests"),
      entitlements: z.array(z.unknown()),
      issuer: z.string(),
      subject: playerUUIDSchema,
      token: z.string().describe("Used as the entitlement in requests"),
    }),
  },
});
