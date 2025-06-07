import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { AxiosInstance } from "axios";

import { isStandardSchema, validate } from "@/utils/standard-schema";

const SCHEMA_KEY = "schema" as const;

export type ValidationConfig<TSchema extends StandardSchemaV1> = {
  [SCHEMA_KEY]?: TSchema;
};

export function attachValidationInterceptor(axiosInstance: AxiosInstance) {
  const responseInterceptorId = axiosInstance.interceptors.response.use(
    async response => {
      if (
        SCHEMA_KEY in response.config &&
        isStandardSchema(response.config[SCHEMA_KEY])
      ) {
        response.data = await validate(
          response.config[SCHEMA_KEY],
          response.data,
        );
      }

      return response;
    },
  );

  return {
    eject() {
      axiosInstance.interceptors.response.eject(responseInterceptorId);
    },
  };
}
