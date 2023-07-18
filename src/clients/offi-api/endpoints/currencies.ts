import { z } from "zod";
import { type OffiApiEndpoint } from "~/clients/offi-api/types";

export const currenciesItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  displayNameSingular: z.string(),
  displayIcon: z.string(),
  largeIcon: z.string(),
  assetPath: z.string(),
});

export const currenciesSchema = z.array(currenciesItemSchema);

export type Currencies = z.infer<typeof currenciesSchema>;

export const CurrenciesEndpoint = {
  url: "https://valorant-api.com/v1/currencies",
  schema: currenciesSchema,
} as const satisfies OffiApiEndpoint;
