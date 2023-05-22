import type { EVENTS } from "./events.autogen.js";

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

export type EventName = (typeof EVENTS)[number];

export type ValorantWebsocketPayload<T = unknown> = {
  data: T;
  eventType: string;
  uri: string;
};
export type ValorantWebsocketMessage = [
  MessageType,
  EventName,
  ValorantWebsocketPayload
];

export interface ValorantWSEE {
  subscribeEvent(event: EventName): void;
  unsubscribeEvent(event: EventName): void;
  on(event: EventName, cb: (data: ValorantWebsocketPayload) => void): void;
  on(event: "event", cb: (data: ValorantWebsocketPayload) => void): void;
  on(event: "close", cb: (code: number, reason: Buffer) => void): void;
  on(event: "error", cb: (err: Error) => void): void;
  on(event: "open", cb: (this: WebSocket) => void): void;
  once(event: EventName, cb: (data: ValorantWebsocketPayload) => void): void;
}
