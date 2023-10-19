import axios from "~/utils/axios";
import type { VapicProvider } from "~/clients";
import {
  type Region,
  type RegionShard,
  getRegionOptions,
  getRsoUserAgent,
  fetchClientVersionFromVAPI,
} from "~/helpers";

/**
 * @client remote
 * @provides shard, region
 */
export function provideRegion<R extends Region | Omit<string, Region>>(
  region: R,
  shard: R extends Region ? RegionShard<R> : string,
) {
  return (() => getRegionOptions(region, shard)) satisfies VapicProvider;
}

/**
 * @client remote
 * @provides client-version
 */
export function provideClientVersion(clientVersion: string) {
  return (() => ({ clientVersion }) as const) satisfies VapicProvider;
}

/**
 * @client remote
 * @provides client-version
 */
export function provideClientVersionViaVAPI() {
  return (async () => {
    return { clientVersion: await fetchClientVersionFromVAPI() } as const;
  }) satisfies VapicProvider;
}

/**
 * @client remote
 * @provides client-version
 */
export function provideClientVersionViaAuthApi() {
  return (async ({ auth }) => {
    const { clientVersion } = auth.options;
    return { clientVersion } as const;
  }) satisfies VapicProvider;
}

/**
 * @client auth
 * @provides rso-user-agent
 */
export function provideRsoUserAgentViaVAPI() {
  return (async () => {
    const { data } = await axios.get<{ data: { riotClientBuild: string } }>(
      "https://valorant-api.com/v1/version",
    );
    const {
      data: { riotClientBuild },
    } = data;
    return { userAgent: getRsoUserAgent(riotClientBuild) } as const;
  }) satisfies VapicProvider;
}
