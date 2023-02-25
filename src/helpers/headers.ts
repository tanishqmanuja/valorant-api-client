import { platformSchema } from "valorant-api-types";
import z from "zod";

export type PlatformInfo = z.infer<typeof platformSchema>;

export type LocalAuthHeaders = {
  Authorization: string;
};

export type RemoteAuthHeaders = {
  Authorization: string;
  "X-Riot-Entitlements-JWT": string;
  "X-Riot-ClientPlatform": string;
  "X-Riot-ClientVersion": string;
  "User-Agent": string;
};

export const getLocalAuthHeader = (
  username: string,
  password: string
): LocalAuthHeaders => ({
  Authorization: `Basic ${generateBasicToken(username, password)}`,
});

export const getAccessTokenHeader = (
  accessToken: string
): Pick<RemoteAuthHeaders, "Authorization"> => ({
  Authorization: `Bearer ${accessToken}`,
});

export const getEntitlementsJWTHeader = (
  entitlementsToken: string
): Pick<RemoteAuthHeaders, "X-Riot-Entitlements-JWT"> => ({
  "X-Riot-Entitlements-JWT": entitlementsToken,
});

export const getClientPlatformHeader = (
  platformInfo: PlatformInfo
): Pick<RemoteAuthHeaders, "X-Riot-ClientPlatform"> => ({
  "X-Riot-ClientPlatform": Buffer.from(JSON.stringify(platformInfo)).toString(
    "base64"
  ),
});

export const getClientVersionHeader = (
  clientVersion: string
): Pick<RemoteAuthHeaders, "X-Riot-ClientVersion"> => ({
  "X-Riot-ClientVersion": clientVersion,
});

export const getUserAgentHeader = (
  userAgent: string
): Pick<RemoteAuthHeaders, "User-Agent"> => ({
  "User-Agent": userAgent,
});

export const getJsonHeader = () => ({
  "Content-Type": "application/json" as const,
});

type RemoteAuthHeadersOpts = {
  accessToken: string;
  entitlementsToken: string;
  platformInfo: PlatformInfo;
  clientVersion: string;
  userAgent: string;
};
export const getRemoteAuthHeaders = (
  options: RemoteAuthHeadersOpts
): RemoteAuthHeaders => ({
  ...getAccessTokenHeader(options.accessToken),
  ...getEntitlementsJWTHeader(options.entitlementsToken),
  ...getClientPlatformHeader(options.platformInfo),
  ...getClientVersionHeader(options.clientVersion),
  ...getUserAgentHeader(options.userAgent),
});

export const generateBasicToken = (username: string, password: string) =>
  Buffer.from(`${username}:${password}`).toString("base64");
