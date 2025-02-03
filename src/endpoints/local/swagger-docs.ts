import { z } from "zod";

import { defineEndpoint } from "../schema";

export default defineEndpoint({
  name: "Swagger Docs",
  description:
    "Fetches json Swagger docs for local endpoints. Can be imported into Swagger or Insomnia.",
  type: "local",
  url: "swagger/v3/openapi.json",
  responses: {
    "200": z.unknown().describe("Swagger doc schema"),
  },
});
