import axios from "axios";

import type { VapicProvider } from "~/clients/valorant/types";
import { fetchClientVersionFromVAPI, getRsoUserAgent } from "~/helpers/general";
import {
  getRegionOptions,
  type Region,
  type RegionShard,
} from "~/helpers/regions";

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
  return (() => ({ clientVersion })) satisfies VapicProvider;
}

/**
 * @client remote
 * @provides client-version
 */
export function provideClientVersionViaVAPI() {
  return (async () => {
    return { clientVersion: await fetchClientVersionFromVAPI() };
  }) satisfies VapicProvider;
}

/**
 * @client remote
 * @provides client-version
 */
export function provideClientVersionViaAuthApi() {
  return (async ({ auth }) => {
    const { clientVersion } = auth.options;
    return { clientVersion };
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
    return { userAgent: getRsoUserAgent(riotClientBuild) };
  }) satisfies VapicProvider;
}

/**
 * @client auth
 * @provides client-version,rso-user-agent
 */
export function provideClientVersionAndRsoUserAgentViaVAPI() {
  return (async () => {
    const { data } = await axios.get<{
      data: { riotClientBuild: string; riotClientVersion: string };
    }>("https://valorant-api.com/v1/version");
    const {
      data: { riotClientBuild, riotClientVersion: clientVersion },
    } = data;

    if (!clientVersion) {
      throw new Error("Client version not found via VAPI");
    }

    return {
      clientVersion,
      rsoUserAgent: getRsoUserAgent(riotClientBuild),
    };
  }) satisfies VapicProvider;
}
