import { z } from "zod/v4";

export const REMOTE_SERVER_TYPES = ["glz", "pd", "shared"] as const;
export type RemoteServerType = (typeof REMOTE_SERVER_TYPES)[number];

export function isRemoteServerType(type: string): type is RemoteServerType {
  return REMOTE_SERVER_TYPES.includes(type as RemoteServerType);
}

export function getRegionAndShardFromGlzServer(glzServer: string) {
  const regex = /https:\/\/glz-(?<region>.*)-1.(?<shard>.*).a.pvp.net/;
  const matches = glzServer.match(regex);
  return z
    .object({
      region: z.string(),
      shard: z.string(),
    })
    .parse(matches?.groups);
}

export function getRemoteServerUrl(options: {
  type: RemoteServerType;
  shard: string;
  region: string;
}): string {
  switch (options.type) {
    case "pd":
      return `https://pd.${options.shard}.a.pvp.net`;
    case "glz":
      return `https://glz-${options.region ?? options.shard}-1.${
        options.shard
      }.a.pvp.net`;
    case "shared":
      return `https://shared.${options.shard}.a.pvp.net`;
  }
}
