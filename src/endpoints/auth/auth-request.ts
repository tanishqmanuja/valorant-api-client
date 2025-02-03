import { z } from "zod";

import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Auth Request",
  description: [
    "Perform authorization request to get token",
    "",
    "Requires cookies from the [POST Auth Cookies] stage. If the user has multi-factor authentication enabled, the response will contain a `type` of `multifactor` and [PUT Multi-Factor Authentication] will need to be used.",
    "",
    "Note: ",
    "Authenticating directly is prone to breakage (captchas and cloudflare anti-bot) and does not support users who use alternative sign-in methods.",
    "Consider using [GET Cookie Reauth] or opening a webview to the Riot login page and watching for redirects.",
  ].join("\n"),
  type: "auth",
  method: "PUT",
  url: "https://auth.riotgames.com/api/v1/authorization",
  headers: {
    "Content-Type": "application/json",
  },
  body: z.object({
    type: z.literal("auth"),
    language: z.literal("en_US"),
    remember: z.boolean(),
    riot_identity: z.object({
      captcha: z
        .string()
        .describe(
          "hcaptcha token from the login page (see <https://docs.hcaptcha.com/>)",
        ),
      username: z.string(),
      password: z.string(),
    }),
  }),
  responses: {
    "200": z.discriminatedUnion("type", [
      z.object({
        type: z.literal("success"),
        success: z.object({
          login_token: z.string(),
          redirect_url: z.string(),
          is_console_link_session: z.boolean(),
          auth_method: z.literal("riot_identity"), //TODO find other auth methods (likely to be google/facebook/others)
          puuid: z.string(),
        }),
        country: z.string(),
        platform: z.string(),
      }),
      z.object({
        type: z.literal("multifactor"),
        multifactor: z.object({
          method: z.literal("email"),
          methods: z.array(z.literal("email")),
          email: z.string().describe("partially-obscured email address"),
          mode: z.literal("auth"),
          auth_method: z.literal("riot_identity"),
        }),
        country: z.string(),
        platform: z.string(),
        error: z
          .literal("invalid_code")
          .optional()
          .describe(
            "The MFA request seems to still give an HTTP response code of 200 for invalid codes but attaches this error property",
          ),
      }),
    ]),
  },
});
