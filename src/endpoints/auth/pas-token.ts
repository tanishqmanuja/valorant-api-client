import { z } from "zod";

import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "PAS Token",
  description:
    "Get a PAS token using the auth token. The PAS token is a JWT that contains the affinity for the XMPP server.",
  type: "auth",
  url: "https://riot-geo.pas.si.riotgames.com/pas/v1/service/chat",
  requirements: ["ACCESS_TOKEN"],
  responses: {
    "200": z.string().describe("The PAS token"),
  },
});
