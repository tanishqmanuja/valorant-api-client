/* THIS IS AN AUTO GENERATED FILE. DO NOT EDIT THIS MANUALLY */

import type { AxiosResponse, AxiosRequestConfig } from "axios";
import type {SetRequired} from "type-fest"
import type { endpoints } from "valorant-api-types";
import z from "zod";

type LocalApiResponse<T extends z.ZodType> = Promise<AxiosResponse<z.output<T>>>

export type LocalApiClient = {
	getLocalHelp: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.localHelpEndpoint.responses["200"]>
	getSessions: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.sessionsEndpoint.responses["200"]>
	getRSOUserInfo: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.rsoUserInfoEndpoint.responses["200"]>
	getClientRegion: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.clientRegionEndpoint.responses["200"]>
	getAccountAlias: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.accountAliasEndpoint.responses["200"]>
	getEntitlementsToken: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.entitlementsTokenEndpoint.responses["200"]>
	getChatSession: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.chatSessionEndpoint.responses["200"]>
	getFriends: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.friendsEndpoint.responses["200"]>
	getPresence: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.presenceEndpoint.responses["200"]>
	getSettings: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.settingsEndpoint.responses["200"]>
	getFriendRequests: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.friendRequestsEndpoint.responses["200"]>
	getLocalSwaggerDocs: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.localSwaggerDocsEndpoint.responses["200"]>
	getPartyChatInfo: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.partyChatInfoEndpoint.responses["200"]>
	getPreGameChatInfo: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.pregameChatInfoEndpoint.responses["200"]>
	getCurrentGameChatInfo: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.currentGameChatInfoEndpoint.responses["200"]>
	getAllChatInfo: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.allChatInfoEndpoint.responses["200"]>
	getChatParticipants: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.chatParticipantsEndpoint.responses["200"]>
	postSendChat: (config: SetRequired<AxiosRequestConfig<z.infer<typeof endpoints.sendChatEndpoint.body>>, "data">) => LocalApiResponse<typeof endpoints.sendChatEndpoint.responses["200"]>
	getChatHistory: (config?: AxiosRequestConfig) => LocalApiResponse<typeof endpoints.chatHistoryEndpoint.responses["200"]>
}
