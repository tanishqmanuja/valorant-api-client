import { AxiosError } from "axios";

export function isCloudflareError(error: unknown) {
  return (
    error instanceof AxiosError &&
    error.response?.status === 403 &&
    typeof error.response?.data === "string" &&
    error.response?.data.includes("Sorry, you have been blocked")
  );
}
