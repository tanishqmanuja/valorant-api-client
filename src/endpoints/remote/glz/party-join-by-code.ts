import { z } from "zod";

import { partyPlayerSchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Party Join By Code",
  description: "Join a party using an invite code",
  type: "glz",
  method: "POST",
  url: "parties/v1/players/joinbycode/:code",
  responses: {
    "200": partyPlayerSchema,
    "404": z.object({
      httpStatus: z.literal(404),
      errorCode: z.literal("ERR_MISSING_INVITE_CODE_MAPPING"),
      message: z.literal("No PartyID <--> InviteCode mapping found"),
    }),
  },
});
