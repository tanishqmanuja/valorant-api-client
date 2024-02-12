import axios, { type AxiosResponse } from "axios";

export function getPuuidFromAccessToken(accessToken: string): string {
  return JSON.parse(
    Buffer.from(accessToken.split(".")[1]!, "base64").toString(),
  ).sub;
}

export async function fetchPas(accessToken: string, idToken: string) {
  const { data } = await axios<{
    token: string;
    affinities: { pbe: string; live: string };
  }>({
    url: "https://riot-geo.pas.si.riotgames.com/pas/v1/product/valorant",
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      id_token: idToken,
    },
  });

  return data;
}

export function parseAuthCookie(response: AxiosResponse) {
  const cookie = response.headers["set-cookie"]
    ?.find(elem => /^asid/.test(elem))
    ?.split(";")
    .at(0);

  if (!cookie) {
    throw Error("No ASID cookie found in response headers");
  }

  return cookie;
}

export const getRsoUserAgent = (clientBuild: string) =>
  `RiotClient/${clientBuild} rso-auth (Windows;10;;Professional, x64)`;

export async function fetchClientVersionFromVAPI(): Promise<string> {
  return axios
    .get<{
      data: { riotClientVersion: string };
    }>("https://valorant-api.com/v1/version")
    .then(res => res.data.data.riotClientVersion);
}
