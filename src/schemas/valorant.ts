import { z } from "zod/v4";

export function uuid() {
  return z
    .string()
    .regex(/^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i);
}

export function stringbool() {
  return z.string().transform(s => s === "true");
}

export function isodatetime() {
  return z.iso.datetime().transform(s => new Date(s));
}

export function millisdatetime() {
  return z.number().transform(s => new Date(s));
}

export function platform() {
  return z.object({
    platformType: z.literal("PC"),
    platformOS: z.literal("Windows"),
    platformOSVersion: z.string(),
    platformChipset: z.literal("Unknown"),
  });
}

export const zv = {
  uuid,
  stringbool,
  datetime: {
    iso: isodatetime,
    millis: millisdatetime,
  },
  platform,
} as const;
