import type { RemoteServerType } from "@/helpers/servers";

import { G, P, S } from "./helpers";

export const GLZ_ENDPOINTS = [
  /* Core Game */
  G("/core-game/v1/matches/:currentGameMatchId/loadouts", ["GET"]),
  G("/core-game/v1/matches/:currentGameMatchId", ["GET"]),
  G("/core-game/v1/players/:puuid", ["GET"]),
  G("/core-game/v1/players/:puuid/disassociate/:currentGameMatchId", ["POST"]),

  /* Pre Game */
  G("/pregame/v1/matches/:pregameMatchId/lock/:agentId", ["POST"]),
  G("/pregame/v1/matches/:pregameMatchId/loadouts", ["GET"]),
  G("/pregame/v1/matches/:pregameMatchId", ["GET"]),
  G("/pregame/v1/players/:puuid", ["GET"]),
  G("/pregame/v1/matches/:pregameMatchId/quit", ["POST"]),
  G("/pregame/v1/matches/:pregameMatchId/select/:agentId", ["POST"]),

  /* Parties */
  G("/parties/v1/parties/:partyId/queue", ["POST"]),
  G("/parties/v1/parties/customgameconfigs", ["GET"]),
  G("/parties/v1/parties/:partyId/matchmaking/join", ["POST"]),
  G("/parties/v1/parties/:partyId/matchmaking/leave", ["POST"]),
  G("/parties/v1/parties/:partyId/muctoken", ["GET"]),
  G("/parties/v1/parties/:partyId/request/:requestId/decline", ["POST"]),
  G("/parties/v1/parties/:partyId/invitecode", ["DELETE", "POST"]),
  G("/parties/v1/parties/:partyId/invites/name/:name/tag/:tagline", ["POST"]),
  G("/parties/v1/players/joinbycode/:code", ["POST"]),
  G("/parties/v1/players/:puuid", ["GET", "DELETE"]),
  G("/parties/v1/parties/:partyId/request", ["POST"]),
  G("/parties/v1/parties/:partyId/members/:puuid/setReady", ["POST"]),
  G("/parties/v1/parties/:partyId/voicetoken", ["GET"]),
  G("/parties/v1/parties/:partyId", ["GET"]),
  G("/parties/v1/parties/:partyId/members/:puuid/refreshPings", ["POST"]),
  G("/parties/v1/parties/:partyId/members/:puuid/refreshCompetitiveTier", [
    "POST",
  ]),
  G("/parties/v1/parties/:partyId/members/:puuid/refreshPlayerIdentity", [
    "POST",
  ]),
  G("/parties/v1/parties/:partyId/customgamesettings", ["POST"]),
  G("/parties/v1/parties/:partyId/accessibility", ["POST"]),
  G("/parties/v1/parties/:partyId/startcustomgame", ["POST"]),
] as const;

export const PD_ENDPOINTS = [
  P("/account-xp/v1/players/:puuid", ["GET"]),
  P("/contracts/v1/contracts/:puuid/special/:contractId", ["POST"]),
  P("/mmr/v1/players/:puuid/competitiveupdates", ["GET"]),
  P("/v1/config/:region", ["GET"]),
  P("/contracts/v1/contracts/:puuid", ["GET"]),
  P("/contract-definitions/v3/item-upgrades", ["GET"]),

  /* Store */
  P("/store/v1/entitlements/:puuid/:itemTypeId", ["GET"]),
  P("/store/v1/offers/:puuid", ["GET"]),
  P("/store/v1/wallet/:puuid", ["GET"]),
  P("/store/v2/storefront/:puuid", ["GET"]),
] as const;

export const SHARED_ENDPOINTS = [S("/content-service/v3/content", ["GET"])];

export const REMOTE_ENDPOINTS = {
  pd: PD_ENDPOINTS,
  glz: GLZ_ENDPOINTS,
  shared: SHARED_ENDPOINTS,
} as const;

export type RemoteEndpoint<TType extends RemoteServerType = RemoteServerType> =
  (typeof REMOTE_ENDPOINTS)[TType][number];
export type RemoteEndpointUrl<
  TType extends RemoteServerType = RemoteServerType,
> = RemoteEndpoint<TType>["url"];
