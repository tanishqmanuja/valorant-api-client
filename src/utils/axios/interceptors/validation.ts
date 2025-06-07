import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { AxiosInstance } from "axios";

import { isStandardSchema, validate } from "@/utils/standard-schema";

const SCHEMA_KEY = "schema" as const;

export type ValidationConfig<TSchema extends StandardSchemaV1> = {
  [SCHEMA_KEY]?: TSchema;
};

export function createValidationInterceptor(axiosInstance: AxiosInstance) {
  return axiosInstance.interceptors.response.use(async response => {
    if (
      SCHEMA_KEY in response.config &&
      isStandardSchema(response.config[SCHEMA_KEY])
    ) {
      validate(response.config[SCHEMA_KEY], response.data);
    }

    return response;
  });
}
