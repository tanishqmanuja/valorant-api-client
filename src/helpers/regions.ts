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

export function getRegionOptions<
  R extends RegionOpts["region"],
  S extends Extract<RegionOpts, { region: R }>["shard"]
>(region: R, shard: S) {
  return { region, shard };
}
