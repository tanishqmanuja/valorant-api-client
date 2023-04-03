import { join } from "node:path";
import type { platformSchema } from "valorant-api-types";
import z from "zod";

type PlatformInfo = z.infer<typeof platformSchema>;

export const LOG_FILE_PATH = join(
  process.env.LOCALAPPDATA!,
  "VALORANT",
  "Saved",
  "Logs",
  "ShooterGame.log"
);

export const LOCK_FILE_PATH = join(
  process.env.LOCALAPPDATA!,
  "Riot Games",
  "Riot Client",
  "Config",
  "lockfile"
);

export const DEFAULT_PLATFORM_INFO: PlatformInfo = {
  platformType: "PC",
  platformOS: "Windows",
  platformOSVersion: "10.0.19044.1.256.64bit",
  platformChipset: "Unknown",
};

export const DEFAULT_USER_AGENT =
  "ShooterGame/13 Windows/10.0.19044.1.256.64bit";
