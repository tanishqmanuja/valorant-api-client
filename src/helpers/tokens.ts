export function getPuuidFromAccessToken(accessToken: string): string {
  return JSON.parse(
    Buffer.from(accessToken.split(".")[1]!, "base64").toString(),
  ).sub;
}
