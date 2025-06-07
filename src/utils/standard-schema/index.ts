import type { StandardSchemaV1 } from "@standard-schema/spec";

import { ValidationError } from "./errors";

export async function validate<TSchema extends StandardSchemaV1>(
  schema: TSchema,
  input: StandardSchemaV1.InferInput<TSchema>,
): Promise<StandardSchemaV1.InferOutput<TSchema>> {
  let result = schema["~standard"].validate(input);
  if (result instanceof Promise) result = await result;
  if (result.issues) throw new ValidationError(result, input);
  return result.value;
}

export const isStandardSchema = (
  schema: unknown,
): schema is StandardSchemaV1 => {
  if (!schema) {
    return false;
  }

  const standard = (schema as StandardSchemaV1)?.["~standard"];

  if (!standard) {
    return false;
  }

  return standard.version === 1 && typeof standard.validate === "function";
};
