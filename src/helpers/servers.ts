import { z } from "zod";

export type LocalServerOptions = {
  type: "local";
  port: string;
};

export const REMOTE_SERVER_TYPES = ["glz", "pd", "shared"] as const;
export type RemoteServerType = (typeof REMOTE_SERVER_TYPES)[number];

export type RemoteServerOptions = {
  type: RemoteServerType;
  shard: string;
  region?: string;
};

export type ServerOptions = LocalServerOptions | RemoteServerOptions;

export function getServerUrl(options: ServerOptions): string {
  switch (options.type) {
    case "local":
      return `https://127.0.0.1:${options.port}`;
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
