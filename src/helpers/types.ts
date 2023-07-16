import { z } from "zod";
import type { platformSchema } from "valorant-api-types";

export type PlatformInfo = z.infer<typeof platformSchema>;
