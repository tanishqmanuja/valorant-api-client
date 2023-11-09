import type { VapicOptionsWithProviders } from "./clients";
import {
  provideAuthViaLocalApi,
  provideClientVersionViaVAPI,
  provideLockFile,
  provideLogFile,
  useProviders,
} from "./providers";

export const LOCAL_CONFIG = {
  auth: useProviders(provideClientVersionViaVAPI()),
  local: useProviders(provideLockFile()),
  remote: useProviders([provideLogFile(), provideAuthViaLocalApi()]),
} satisfies VapicOptionsWithProviders;
