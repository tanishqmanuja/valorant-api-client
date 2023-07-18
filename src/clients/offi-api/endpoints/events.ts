import { z } from "zod";
import { type OffiApiEndpoint } from "~/clients/offi-api/types";

export const eventsItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  shortDisplayName: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  assetPath: z.string(),
});

export const eventsSchema = z.array(eventsItemSchema);

export type Events = z.infer<typeof eventsSchema>;

export const EventsEndpoint = {
  url: "https://valorant-api.com/v1/events",
  schema: eventsSchema,
} as const satisfies OffiApiEndpoint;
