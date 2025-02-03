import { z } from "zod";

import { gameModeSchema, mapIDSchema, partySchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Set Custom Game Settings",
  description: "Changes the settings for a custom game",
  type: "glz",
  method: "POST",
  url: "parties/v1/parties/:partyId/customgamesettings",
  body: z.object({
    Map: mapIDSchema,
    Mode: gameModeSchema,
    UseBots: z.boolean(),
    GamePod: z.string(),
    GameRules: z.object({
      AllowGameModifiers: z.enum(["true", "false"]),
      PlayOutAllRounds: z.enum(["true", "false"]),
      SkipMatchHistory: z.enum(["true", "false"]),
      TournamentMode: z.enum(["true", "false"]),
      IsOvertimeWinByTwo: z.enum(["true", "false"]),
    }),
  }),
  responses: {
    "200": partySchema,
  },
});
