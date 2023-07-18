import type { ZodSchema } from "zod";

export type OffiApiResponse<T = unknown> =
  | {
      status: 200;
      data: T;
    }
  | {
      status: 400;
      error: string;
    };

export type OffiApiEndpoint = {
  url: string;
  schema: ZodSchema;
};
