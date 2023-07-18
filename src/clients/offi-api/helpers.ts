import axios, { AxiosError } from "axios";
import type { OffiApiResponse } from "./types";

export function getOffiApiAxiosClient() {
  return axios.create({
    transformResponse: [
      (data: string) => JSON.parse(data),
      (data: OffiApiResponse) => {
        if (data.status === 200) {
          return data.data;
        } else {
          throw new AxiosError(data.error, "400");
        }
      },
    ],
  });
}
