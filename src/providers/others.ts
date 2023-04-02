import axios from "axios";

import type { Region, RegionShard } from "~/helpers/regions.js";

export function provideRegion<R extends Region>(
  region: R,
  shard: RegionShard<R>
) {
  return () => ({ region, shard } as const);
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
