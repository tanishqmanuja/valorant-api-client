import type { VapicOptionsWithProviders } from "./clients";
import {
  provideAuthAutoRegion,
  provideAuthViaLocalApi,
  provideClientVersionAndRsoUserAgentViaVAPI,
  provideClientVersionViaAuthApi,
  provideClientVersionViaVAPI,
  provideLockFile,
  provideLogFile,
  useProviders,
} from "./providers";

export type Credentials = {
  username: string;
  password: string;
};

const local = {
  auth: useProviders(provideClientVersionAndRsoUserAgentViaVAPI()),
  local: useProviders(provideLockFile()),
  remote: useProviders([provideLogFile(), provideAuthViaLocalApi()]),
} satisfies VapicOptionsWithProviders;

const remote = {
  with: ({ username, password }: Credentials) =>
    ({
      auth: useProviders(provideClientVersionViaVAPI()),
      remote: useProviders([
        provideClientVersionViaAuthApi(),
        provideAuthAutoRegion(username, password),
      ]),
    }) satisfies VapicOptionsWithProviders,
};

export const presets = {
  local,
  remote,
};
