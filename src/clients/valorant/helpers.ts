import type {
  VapicOptions,
  VapicOptionsWithProviders,
  VapicProvider,
} from "./types";

export function isProvider(provider: unknown): provider is VapicProvider {
  return typeof provider === "function";
}

export function isOptionsWithoutProvider(
  options: VapicOptionsWithProviders,
): options is VapicOptions {
  return !Object.values(options).some((o) => isProvider(o));
}
