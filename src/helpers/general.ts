import axios from "axios";

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

export const getRsoUserAgent = (clientBuild: string) =>
  `RiotClient/${clientBuild} rso-auth (Windows;10;;Professional, x64)`;

export async function fetchClientVersionFromVAPI(): Promise<string> {
  return axios
    .get<{
      data: { riotClientVersion: string };
    }>("https://valorant-api.com/v1/version")
    .then((res) => res.data.data.riotClientVersion);
}
