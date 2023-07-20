import { z } from "zod";
import type { platformSchema } from "@tqman/valorant-api-types";

export type PlatformInfo = z.infer<typeof platformSchema>;
