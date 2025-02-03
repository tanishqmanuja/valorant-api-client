import { z } from "zod";

import {
  dateSchema,
  matchIDSchema,
  playerUUIDSchema,
} from "../../common-types";
import { defineEndpoint } from "../../schema";

const progressSchema = z.object({
  Level: z.number(),
  XP: z.number(),
});

export default defineEndpoint({
  name: "Account XP",
  description:
    "Get the account level, XP, and XP history for the current player. This endpoint only works with the authenticated player's PUUID.",
  type: "pd",
  url: "account-xp/v1/players/:puuid",
  responses: {
    "200": z.object({
      Version: z.number(),
      Subject: playerUUIDSchema,
      Progress: progressSchema,
      History: z.array(
        z.object({
          ID: matchIDSchema,
          MatchStart: dateSchema,
          StartProgress: progressSchema,
          EndProgress: progressSchema,
          XPDelta: z.number(),
          XPSources: z.array(
            z.object({
              ID: z.enum(["time-played", "match-win", "first-win-of-the-day"]),
              Amount: z.number(),
            }),
          ),
          XPMultipliers: z.array(z.unknown()),
        }),
      ),
      LastTimeGrantedFirstWin: dateSchema,
      NextTimeFirstWinAvailable: dateSchema,
    }),
  },
});
