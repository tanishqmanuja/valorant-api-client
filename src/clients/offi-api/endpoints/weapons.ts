/* THIS IS AN AUTO GENERATED FILE - DO NOT EDIT */
import { z } from "zod";

import type { OffiApiEndpoint } from "~/clients/offi-api/types";

export const adsStatsSchema = z.object({
  zoomMultiplier: z.number(),
  fireRate: z.number(),
  runSpeedMultiplier: z.number(),
  burstCount: z.number(),
  firstBulletAccuracy: z.number(),
});

export const damageRangesItemSchema = z.object({
  rangeStartMeters: z.number(),
  rangeEndMeters: z.number(),
  headDamage: z.number(),
  bodyDamage: z.number(),
  legDamage: z.number(),
});

export const gridPositionSchema = z.object({
  row: z.number(),
  column: z.number(),
});

export const chromasItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  displayIcon: z.string().nullable(),
  fullRender: z.string(),
  swatch: z.string().nullable(),
  streamedVideo: z.string().nullable(),
  assetPath: z.string(),
});

export const levelsItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  levelItem: z.string().nullable(),
  displayIcon: z.string().nullable(),
  streamedVideo: z.string().nullable(),
  assetPath: z.string(),
});

export const airBurstStatsSchema = z.object({
  shotgunPelletCount: z.number(),
  burstDistance: z.number(),
});

export const altShotgunStatsSchema = z.object({
  shotgunPelletCount: z.number(),
  burstRate: z.number(),
});

export const weaponStatsSchema = z.object({
  fireRate: z.number(),
  magazineSize: z.number(),
  runSpeedMultiplier: z.number(),
  equipTimeSeconds: z.number(),
  reloadTimeSeconds: z.number(),
  firstBulletAccuracy: z.number(),
  shotgunPelletCount: z.number(),
  wallPenetration: z.string(),
  feature: z.string().nullable(),
  fireMode: z.string().nullable(),
  altFireType: z.string().nullable(),
  adsStats: adsStatsSchema.nullable(),
  altShotgunStats: altShotgunStatsSchema.nullable(),
  airBurstStats: airBurstStatsSchema.nullable(),
  damageRanges: z.array(damageRangesItemSchema),
});

export const shopDataSchema = z.object({
  cost: z.number(),
  category: z.string(),
  categoryText: z.string(),
  gridPosition: gridPositionSchema.nullable(),
  canBeTrashed: z.boolean(),
  image: z.null(),
  newImage: z.string(),
  newImage2: z.null(),
  assetPath: z.string(),
});

export const skinsItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  themeUuid: z.string(),
  contentTierUuid: z.string().nullable(),
  displayIcon: z.string().nullable(),
  wallpaper: z.string().nullable(),
  assetPath: z.string(),
  chromas: z.array(chromasItemSchema),
  levels: z.array(levelsItemSchema),
});

export const weaponsItemSchema = z.object({
  uuid: z.string(),
  displayName: z.string(),
  category: z.string(),
  defaultSkinUuid: z.string(),
  displayIcon: z.string(),
  killStreamIcon: z.string(),
  assetPath: z.string(),
  weaponStats: weaponStatsSchema.nullable(),
  shopData: shopDataSchema.nullable(),
  skins: z.array(skinsItemSchema),
});

export const weaponsSchema = z.array(weaponsItemSchema);

export type Weapons = z.infer<typeof weaponsSchema>;

export const WeaponsEndpoint = {
  url: "https://valorant-api.com/v1/weapons",
  schema: weaponsSchema,
} as const satisfies OffiApiEndpoint;
