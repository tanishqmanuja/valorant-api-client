import { z } from "zod";

import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Riot Geo",
  description:
    "Get the region for a given ID token and auth token. The ID token and auth token can be obtained from [PUT Cookie Reauth]",
  type: "auth",
  url: "https://riot-geo.pas.si.riotgames.com/pas/v1/product/valorant",
  method: "PUT",
  requirements: ["ACCESS_TOKEN"],
  body: z.object({
    id_token: z.string().describe("The ID token"),
  }),
  responses: {
    "200": z.object({
      token: z.string(),
      affinities: z
        .object({
          pbe: z.string(),
          live: z.string(),
        })
        .describe("The region IDs for PBE and live servers"),
    }),
  },
});
