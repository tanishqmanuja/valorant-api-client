import { z } from "zod";

import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Sessions",
  description: [
    "Gets info about the running Valorant process including start arguments",
    "Can be used to get shard, region, and puuid by parsing launch args.",
  ].join(" \n"),
  type: "local",
  url: "product-session/v1/external-sessions",
  responses: {
    "200": z.record(
      z.string().describe("Session ID"),
      z.object({
        exitCode: z.number(),
        exitReason: z.null(),
        isInternal: z.boolean(),
        launchConfiguration: z.object({
          arguments: z.array(z.string()),
          executable: z.string(),
          locale: z.string().nullable(),
          voiceLocale: z.null(),
          workingDirectory: z.string(),
        }),
        patchlineFullName: z.enum(["VALORANT", "riot_client"]),
        patchlineId: z.enum(["", "live", "pbe"]),
        phase: z.string(),
        productId: z.enum(["valorant", "riot_client"]),
        version: z.string(),
      }),
    ),
  },
});
