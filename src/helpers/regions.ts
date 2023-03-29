export const regionShardMap = {
  latam: ["na"],
  br: ["na"],
  na: ["na", "pbe"],
  eu: ["eu"],
  ap: ["ap"],
  kr: ["kr"],
} as const;

export type Region = keyof typeof regionShardMap;
export type RegionShard<R extends Region = Region> =
  (typeof regionShardMap)[R][number];

export function getRegionOptions<R extends Region>(
  region: R,
  shard: RegionShard<R>
) {
  return { region, shard };
}
