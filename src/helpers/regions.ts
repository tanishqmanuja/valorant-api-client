import { fetchPas } from "./general";

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

export function getRegionOptions<R extends Region | Omit<string, Region>>(
  region: R,
  shard: R extends Region ? RegionShard<R> : string,
) {
  return { region: region as Region, shard: shard as RegionShard };
}

export async function getRegionAndShardFromPas(
  accessToken: string,
  idToken: string,
) {
  const {
    affinities: { live: possibleRegion },
  } = await fetchPas(accessToken, idToken);

  const possibleRegionShardMapEntry = Object.entries(regionShardMap).find(
    ([region]) => region === possibleRegion,
  );

  if (!possibleRegionShardMapEntry) {
    throw Error(`Unable to find region shard for ${possibleRegion}`);
  }

  const region = possibleRegionShardMapEntry[0];
  const shard = possibleRegionShardMapEntry[1].at(0)!;

  return { region, shard };
}
