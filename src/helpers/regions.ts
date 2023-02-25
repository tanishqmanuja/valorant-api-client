export type RegionOpts =
  | {
      region: "latam";
      shard: "na";
    }
  | {
      region: "br";
      shard: "na";
    }
  | {
      region: "na";
      shard: "na";
    }
  | {
      region: "na";
      shard: "pbe";
    }
  | {
      region: "eu";
      shard: "eu";
    }
  | {
      region: "ap";
      shard: "ap";
    }
  | {
      region: "kr";
      shard: "kr";
    };

export function getRegionOptions<R extends RegionOpts["region"]>(
  region: R,
  shard: Extract<RegionOpts, { region: R }>["shard"]
) {
  return { region, shard };
}

getRegionOptions("ap", "ap");
