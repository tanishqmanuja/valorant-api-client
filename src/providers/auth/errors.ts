import type { AxiosResponse } from "axios";
import type { AuthMFAResponse } from "./types";

export class MFAError extends Error {
  constructor(
    public message: string,
    public response: AxiosResponse<AuthMFAResponse>,
  ) {
    super(message);
  }
}
