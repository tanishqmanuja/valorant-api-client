import { z } from "zod";

const zc = {
  zodschema: z.custom<z.ZodType>((value) => value instanceof z.ZodType),
};

const valorantEndpointSchema = z
  .object({
    name: z.string(),
    description: z.string().optional(),
    type: z.enum(["auth", "local", "pd", "glz", "shared"]),
    method: z.enum(["GET", "POST", "PUT", "DELETE"]).default("GET"),
    url: z.string(),
    headers: z.record(z.string()).optional(),
    requirements: z
      .array(
        z.enum([
          "ACCESS_TOKEN",
          "ENTITLEMENTS_TOKEN",
          "CLIENT_VERSION",
          "CLIENT_PLATFORM",
          "LOCAL_AUTH",
        ]),
      )
      .default([]),
    body: zc.zodschema.optional(),
    query: zc.zodschema.optional(),
    responses: z.record(zc.zodschema).optional(),
  })
  .transform((data) => {
    const REMOTE_ENDPOINTS = ["glz", "pd", "shared"];
    const REMOTE_REQUIREMENTS = [
      "ACCESS_TOKEN",
      "ENTITLEMENTS_TOKEN",
      "CLIENT_VERSION",
      "CLIENT_PLATFORM",
    ];

    const LOCAL_REQUIREMENTS = ["LOCAL_AUTH"];

    const requirements = REMOTE_ENDPOINTS.includes(data.type)
      ? REMOTE_REQUIREMENTS
      : data.type === "local"
        ? LOCAL_REQUIREMENTS
        : [];

    return {
      ...data,
      requirements: [...new Set([...data.requirements, ...requirements])],
    };
  });

export type ValorantEndpoint = z.output<typeof valorantEndpointSchema>;

type StaticKeys = "name" | "type" | "url";
export function defineEndpoint<
  const Schema extends z.input<typeof valorantEndpointSchema>,
>(
  schema: Schema,
): Omit<ValorantEndpoint, StaticKeys> &
  Pick<Schema, StaticKeys> & { ["~type"]: Schema } {
  return {
    get ["~type"](): Schema {
      throw new Error("NOT FOR RUNTIME");
    },
    ...valorantEndpointSchema.parse(schema),
  };
}
