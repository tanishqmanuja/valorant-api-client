import type {
  VapicProvider,
  VapicOptionsWithProviders,
  VapicOptions,
} from "./types";

export const CLIENT_RESOLUTION_ORDER = ["auth", "local", "remote"] as const;

export function isProvider(provider: unknown): provider is VapicProvider {
  return typeof provider === "function";
}

export function isOptionsWithoutProvider(
  options: VapicOptionsWithProviders,
): options is VapicOptions {
  return !Object.values(options).some(o => isProvider(o));
}
