import { useProviders } from "~/providers";
import { provideAuthViaLocalApi } from "~/providers/auth";
import { provideLockFile, provideLogFile } from "~/providers/file";
import { provideClientVersionAndRsoUserAgentViaVAPI } from "~/providers/general";

import type { VapicOptionsWithProviders } from "./types";

const local = {
  auth: useProviders(provideClientVersionAndRsoUserAgentViaVAPI()),
  local: useProviders(provideLockFile()),
  remote: useProviders([provideLogFile(), provideAuthViaLocalApi()]),
} satisfies VapicOptionsWithProviders;

export const presets = {
  local,
};
