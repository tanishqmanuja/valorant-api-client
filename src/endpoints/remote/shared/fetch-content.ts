import { z } from "zod";

import { dateSchema, weakUUIDSchema } from "../../common-types";
import { defineEndpoint } from "../../schema";

export default defineEndpoint({
  name: "Fetch Content",
  description: "Get a list of seasons, acts, and events",
  type: "shared",
  url: "content-service/v3/content",
  responses: {
    "200": z.object({
      DisabledIDs: z.array(z.unknown()),
      Seasons: z.array(
        z.object({
          ID: weakUUIDSchema,
          Name: z.string(),
          Type: z.enum(["episode", "act"]),
          StartTime: dateSchema,
          EndTime: dateSchema,
          IsActive: z.boolean(),
        }),
      ),
      Events: z.array(
        z.object({
          ID: weakUUIDSchema,
          Name: z.string(),
          StartTime: dateSchema,
          EndTime: dateSchema,
          IsActive: z.boolean(),
        }),
      ),
    }),
  },
});
