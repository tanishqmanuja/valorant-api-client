import { createValorantApiClient } from "@tqman/valorant-api-client";
import { z } from "zod/v4";

const v = await createValorantApiClient({ initializer: "local" });
const { data: updates } = await v.remote.request("pd","/mmr/v1/players/:puuid/competitiveupdates",{
  schema: z.object({
    Version: z.number(),
    Subject: z.string(),
    Matches: z.array(
      z.object({
        MatchID: z.string(),
        RankedRatingEarned: z.number(),
      }),
    ),
  }),
})

const avg = updates.Matches.reduce((a, b) => a + b.RankedRatingEarned, 0) / updates.Matches.length;
console.log(`Average RankedRatingEarned Per Match: ${avg}`);

