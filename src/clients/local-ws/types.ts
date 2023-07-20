import type { EVENTS } from "./types/events";
import { FUNCTIONS } from "./types/functions";

export const MESSAGE_TYPES = {
  Welcome: 0,
  Prefix: 1,
  Call: 2,
  CallResult: 3,
  CallError: 4,
  Subscribe: 5,
  Unsubscribe: 6,
  Publish: 7,
  Event: 8,
} as const;

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

export type ValorantWsEvent = (typeof EVENTS)[number];
export type BasicWsEvent = "open" | "close" | "error" | "message";
export type WsEvent = ValorantWsEvent | BasicWsEvent;

export type ValorantWsFunction = (typeof FUNCTIONS)[number];

export type ValorantWebsocketPayload<T = unknown> = {
  data: T;
  eventType: string;
  uri: string;
};

export type ValorantWebsocketMessage<T = unknown> = [
  MessageType,
  ValorantWsEvent,
  ValorantWebsocketPayload<T>,
];
