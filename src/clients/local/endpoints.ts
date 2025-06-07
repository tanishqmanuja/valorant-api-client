import { L } from "./helpers";

export const LOCAL_ENDPOINTS = [
  L("/help", ["GET"]),
  L("/entitlements/v1/token", ["GET"]),
  L("/swagger/v3/openapi.json", ["GET"]),
  L("/riotclient/region-locale", ["GET"]),
  L("/rso-auth/v1/authorization/userinfo", ["GET"]),
  L("/product-session/v1/external-sessions", ["GET"]),

  /* Player */
  L("/player-account/aliases/v1/active", ["GET"]),
  L("/player-preferences/v1/data-json/Ares.PlayerSettings", ["GET"]),

  /* Chat */
  L("/chat/v1/session", ["GET"]),
  L("/chat/v4/friends", ["GET"]),
  L("/chat/v4/friendrequests", ["GET", "POST", "DELETE"]),
  L("/chat/v4/presences", ["GET"]),
  L("/chat/v5/participants", ["GET"]),
  L("/chat/v6/conversations", ["GET"]),
  L("/chat/v6/conversations/ares-coregame", ["GET"]),
  L("/chat/v6/messages", ["GET", "POST"]),
  L("/chat/v6/conversations/ares-parties", ["GET"]),
  L("/chat/v6/conversations/ares-pregame", ["GET"]),
] as const;

export type LocalEndpoint = (typeof LOCAL_ENDPOINTS)[number];
export type LocalEndpointUrl = LocalEndpoint["url"];
