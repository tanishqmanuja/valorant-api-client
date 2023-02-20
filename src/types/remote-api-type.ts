/* THIS IS AN AUTO GENERATED FILE. DO NOT EDIT THIS MANUALLY */

import type { AxiosResponse, AxiosRequestConfig } from "axios";
import type {SetRequired} from "type-fest"
import type { endpoints } from "valorant-api-types";
import z from "zod";

type RemoteApiResponse<T extends z.ZodType> = Promise<AxiosResponse<z.output<T>>>

export type RemoteApiClient = {
	getFetchContent: (config?: AxiosRequestConfig) => RemoteApiResponse<typeof endpoints.fetchContentEndpoint.responses["200"]>
	getAccountXP: (config: SetRequired<AxiosRequestConfig<{puuid: string}>, "data">) => RemoteApiResponse<typeof endpoints.accountXPEndpoint.responses["200"]>
	getPlayerLoadout: (config: SetRequired<AxiosRequestConfig<{puuid: string}>, "data">) => RemoteApiResponse<typeof endpoints.playerLoadoutEndpoint.responses["200"]>
	putSetPlayerLoadout: (config: SetRequired<AxiosRequestConfig<{puuid: string}>, "data">) => RemoteApiResponse<typeof endpoints.setPlayerLoadoutEndpoint.responses["200"]>
	getPlayerMMR: (config: SetRequired<AxiosRequestConfig<{puuid: string}>, "data">) => RemoteApiResponse<typeof endpoints.playerMMREndpoint.responses["200"]>
	getMatchHistory: (config: SetRequired<AxiosRequestConfig<{puuid: string}>, "data">) => RemoteApiResponse<typeof endpoints.matchHistoryEndpoint.responses["200"]>
	getMatchDetails: (config: SetRequired<AxiosRequestConfig<{matchID: string}>, "data">) => RemoteApiResponse<typeof endpoints.matchDetailsEndpoint.responses["200"]>
	getCompetitiveUpdates: (config: SetRequired<AxiosRequestConfig<{puuid: string}>, "data">) => RemoteApiResponse<typeof endpoints.competitiveUpdatesEndpoint.responses["200"]>
	getLeaderboard: (config: SetRequired<AxiosRequestConfig<{seasonId: string}>, "data">) => RemoteApiResponse<typeof endpoints.leaderboardEndpoint.responses["200"]>
	getPenalties: (config?: AxiosRequestConfig) => RemoteApiResponse<typeof endpoints.penaltiesEndpoint.responses["200"]>
	getConfig: (config: SetRequired<AxiosRequestConfig<{region: string}>, "data">) => RemoteApiResponse<typeof endpoints.configEndpoint.responses["200"]>
	getParty: (config: SetRequired<AxiosRequestConfig<{partyId: string}>, "data">) => RemoteApiResponse<typeof endpoints.partyEndpoint.responses["200"]>
	getPartyPlayer: (config: SetRequired<AxiosRequestConfig<{puuid: string}>, "data">) => RemoteApiResponse<typeof endpoints.partyPlayerEndpoint.responses["200"]>
	deletePartyRemovePlayer: (config: SetRequired<AxiosRequestConfig<{puuid: string}>, "data">) => RemoteApiResponse<typeof endpoints.partyRemovePlayerEndpoint.responses["204"]>
	postPartySetMemberReady: (config: SetRequired<AxiosRequestConfig<{partyId: string,puuid: string}>, "data">) => RemoteApiResponse<typeof endpoints.partySetMemberReadyEndpoint.responses["200"]>
	postRefreshCompetitiveTier: (config: SetRequired<AxiosRequestConfig<{partyId: string,puuid: string}>, "data">) => RemoteApiResponse<typeof endpoints.refreshCompetitiveTierEndpoint.responses["200"]>
	postRefreshPlayerIdentity: (config: SetRequired<AxiosRequestConfig<{partyId: string,puuid: string}>, "data">) => RemoteApiResponse<typeof endpoints.refreshPlayerIdentityEndpoint.responses["200"]>
	postRefreshPings: (config: SetRequired<AxiosRequestConfig<{partyId: string,puuid: string}>, "data">) => RemoteApiResponse<typeof endpoints.refreshPingsEndpoint.responses["200"]>
	postChangeQueue: (config: SetRequired<AxiosRequestConfig<z.infer<typeof endpoints.changeQueueEndpoint.body>>, "data">) => RemoteApiResponse<typeof endpoints.changeQueueEndpoint.responses["200"]>
	postStartCustomGame: (config: SetRequired<AxiosRequestConfig<{partyId: string}>, "data">) => RemoteApiResponse<typeof endpoints.startCustomGameEndpoint.responses["200"]>
	postEnterMatchmakingQueue: (config: SetRequired<AxiosRequestConfig<{partyId: string}>, "data">) => RemoteApiResponse<typeof endpoints.enterMatchmakingQueueEndpoint.responses["200"]>
	postLeaveMatchmakingQueue: (config: SetRequired<AxiosRequestConfig<{partyId: string}>, "data">) => RemoteApiResponse<typeof endpoints.leaveMatchmakingQueueEndpoint.responses["200"]>
	postSetPartyAccessibility: (config: SetRequired<AxiosRequestConfig<z.infer<typeof endpoints.setPartyAccessibilityEndpoint.body>>, "data">) => RemoteApiResponse<typeof endpoints.setPartyAccessibilityEndpoint.responses["200"]>
	postSetCustomGameSettings: (config: SetRequired<AxiosRequestConfig<z.infer<typeof endpoints.setCustomGameSettingsEndpoint.body>>, "data">) => RemoteApiResponse<typeof endpoints.setCustomGameSettingsEndpoint.responses["200"]>
	postPartyInvite: (config: SetRequired<AxiosRequestConfig<{partyId: string,name: string,tagline: string}>, "data">) => RemoteApiResponse<typeof endpoints.partyInviteEndpoint.responses["200"]>
	postPartyRequest: (config: SetRequired<AxiosRequestConfig<{partyId: string}>, "data">) => RemoteApiResponse<typeof endpoints.partyRequestEndpoint.responses["200"]>
	postPartyDecline: (config: SetRequired<AxiosRequestConfig<{partyId: string,requestId: string}>, "data">) => RemoteApiResponse<typeof endpoints.partyDeclineEndpoint.responses["200"]>
	getCustomGameConfigs: (config?: AxiosRequestConfig) => RemoteApiResponse<typeof endpoints.customGameConfigsEndpoint.responses["200"]>
	getPartyChatToken: (config: SetRequired<AxiosRequestConfig<{partyId: string}>, "data">) => RemoteApiResponse<typeof endpoints.partyChatTokenEndpoint.responses["200"]>
	getPartyVoiceToken: (config: SetRequired<AxiosRequestConfig<{partyId: string}>, "data">) => RemoteApiResponse<typeof endpoints.partyVoiceTokenEndpoint.responses["200"]>
	getPrices: (config?: AxiosRequestConfig) => RemoteApiResponse<typeof endpoints.pricesEndpoint.responses["200"]>
	getStorefront: (config: SetRequired<AxiosRequestConfig<{puuid: string}>, "data">) => RemoteApiResponse<typeof endpoints.storefrontEndpoint.responses["200"]>
	getWallet: (config: SetRequired<AxiosRequestConfig<{puuid: string}>, "data">) => RemoteApiResponse<typeof endpoints.walletEndpoint.responses["200"]>
	getOwnedItems: (config: SetRequired<AxiosRequestConfig<{puuid: string,itemTypeID: string}>, "data">) => RemoteApiResponse<typeof endpoints.ownedItemsEndpoint.responses["200"]>
	getPreGamePlayer: (config: SetRequired<AxiosRequestConfig<{puuid: string}>, "data">) => RemoteApiResponse<typeof endpoints.pregamePlayerEndpoint.responses["200"]>
	getPreGameMatch: (config: SetRequired<AxiosRequestConfig<{preGameMatchId: string}>, "data">) => RemoteApiResponse<typeof endpoints.pregameMatchEndpoint.responses["200"]>
	getPreGameLoadouts: (config: SetRequired<AxiosRequestConfig<{preGameMatchId: string}>, "data">) => RemoteApiResponse<typeof endpoints.pregameLoadoutsEndpoint.responses["200"]>
	postSelectCharacter: (config: SetRequired<AxiosRequestConfig<{preGameMatchId: string,agentId: string}>, "data">) => RemoteApiResponse<typeof endpoints.selectCharacterEndpoint.responses["200"]>
	postLockCharacter: (config: SetRequired<AxiosRequestConfig<{preGameMatchId: string,agentId: string}>, "data">) => RemoteApiResponse<typeof endpoints.lockCharacterEndpoint.responses["200"]>
	postPreGameQuit: (config: SetRequired<AxiosRequestConfig<{preGameMatchId: string}>, "data">) => RemoteApiResponse<typeof endpoints.pregameQuitEndpoint.responses["204"]>
	getCurrentGamePlayer: (config: SetRequired<AxiosRequestConfig<{puuid: string}>, "data">) => RemoteApiResponse<typeof endpoints.currentGamePlayerEndpoint.responses["200"]>
	getCurrentGameMatch: (config: SetRequired<AxiosRequestConfig<{currentGameMatchId: string}>, "data">) => RemoteApiResponse<typeof endpoints.currentGameMatchEndpoint.responses["200"]>
	getCurrentGameLoadouts: (config: SetRequired<AxiosRequestConfig<{currentGameMatchId: string}>, "data">) => RemoteApiResponse<typeof endpoints.currentGameLoadoutsEndpoint.responses["200"]>
	postCurrentGameQuit: (config: SetRequired<AxiosRequestConfig<{puuid: string,currentGameMatchId: string}>, "data">) => RemoteApiResponse<typeof endpoints.currentGameQuitEndpoint.responses["204"]>
	getItemUpgrades: (config?: AxiosRequestConfig) => RemoteApiResponse<typeof endpoints.itemUpgradesEndpoint.responses["200"]>
	getContracts: (config: SetRequired<AxiosRequestConfig<{puuid: string}>, "data">) => RemoteApiResponse<typeof endpoints.contractsEndpoint.responses["200"]>
	postActivateContract: (config: SetRequired<AxiosRequestConfig<{puuid: string,contractId: string}>, "data">) => RemoteApiResponse<typeof endpoints.activateContractEndpoint.responses["200"]>
}
