import type { VapicOptionsWithProviders } from "./clients";
import {
  provideAuthAutoRegion,
  provideAuthViaLocalApi,
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
  auth: useProviders(provideClientVersionViaVAPI()),
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

export default presets;
