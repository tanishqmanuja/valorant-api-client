import { z } from "zod/v4";

import { zv } from "@/schemas/valorant";

type PlatformInfo = z.output<ReturnType<typeof zv.platform>>;

export const DEFAULT_PLATFORM_INFO: PlatformInfo = {
  platformType: "PC",
  platformOS: "Windows",
  platformOSVersion: "10.0.19044.1.256.64bit",
  platformChipset: "Unknown",
};

export const DEFAULT_USER_AGENT =
  "ShooterGame/13 Windows/10.0.19044.1.256.64bit";
