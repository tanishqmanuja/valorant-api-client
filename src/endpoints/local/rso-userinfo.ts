import { z } from "zod";

import { millisSchema, playerUUIDSchema } from "../common-types";
import { defineEndpoint } from "../schema";

const userInfoSchema = z.object({
  acct: z.object({
    adm: z.boolean(),
    created_at: millisSchema,
    game_name: z.string(),
    state: z.string(),
    tag_line: z.string(),
    type: z.number(),
  }),
  ban: z.object({
    code: z.unknown().nullable().optional(),
    desc: z.string().optional(),
    exp: z.unknown().nullable().optional(),
    restrictions: z.array(z.unknown()),
  }),
  country: z.string(),
  country_at: millisSchema,
  email_verified: z.boolean(),
  jti: z.string(),
  lol: z.unknown().nullable(),
  lol_region: z.array(z.unknown()),
  original_account_id: z.unknown().nullable(),
  original_platform_id: z.unknown().nullable(),
  phone_number_verified: z.boolean(),
  player_locale: z.string(),
  player_plocale: z.unknown().nullable(),
  ppid: z.unknown().nullable(),
  preferred_username: z.string(),
  pvpnet_account_id: z.unknown().nullable(),
  pw: z
    .object({
      cng_at: millisSchema,
      must_reset: z.boolean(),
      reset: z.boolean(),
    })
    .describe("Password info"),
  sub: playerUUIDSchema,
  username: z.string(),
});

export default defineEndpoint({
  name: "RSO User Info",
  description: "Get RSO user info",
  type: "local",
  url: "rso-auth/v1/authorization/userinfo",
  responses: {
    "200": z.object({
      userInfo: z
        .string()
        .transform((str) => userInfoSchema.parse(JSON.parse(str))),
    }),
  },
});
