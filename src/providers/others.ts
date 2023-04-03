import axios from "axios";

import { Region, RegionShard, getRegionOptions } from "~/helpers/regions.js";

import { getRsoUserAgent } from "..";

export function provideRegion<R extends Region | Omit<string, Region>>(
  region: R,
  shard: R extends Region ? RegionShard<R> : string
) {
  return () => getRegionOptions(region, shard);
}

export function provideClientVersion(clientVersion: string) {
  return () => ({ clientVersion } as const);
}

export function provideClientVersionViaVAPI() {
  return async () => {
    const { data } = await axios.get<{ data: { riotClientVersion: string } }>(
      "https://valorant-api.com/v1/version"
    );
    const {
      data: { riotClientVersion },
    } = data;
    return { clientVersion: riotClientVersion } as const;
  };
}

export function provideRsoUserAgentViaVAPI() {
  return async () => {
    const { data } = await axios.get<{ data: { riotClientBuild: string } }>(
      "https://valorant-api.com/v1/version"
    );
    const {
      data: { riotClientBuild },
    } = data;
    return { userAgent: getRsoUserAgent(riotClientBuild) } as const;
  };
}
