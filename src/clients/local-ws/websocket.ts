import { WebSocket, type ClientOptions } from "ws";

import {
  type EventName,
  MESSAGE_TYPES,
  type ValorantWebsocketMessage,
} from "./types";

export class ValorantWebSocket extends WebSocket {
  constructor(address: string, options?: ClientOptions) {
    super(address, { rejectUnauthorized: false, ...options });
    this.on("message", this.#onMessage.bind(this));
  }

  subscribeEvent(event: EventName) {
    this.send(JSON.stringify([MESSAGE_TYPES.Subscribe, event]));
  }

  unsubscribeEvent(event: EventName) {
    this.send(JSON.stringify([MESSAGE_TYPES.Unsubscribe, event]));
  }

  #onMessage(data: string) {
    if (!data.length) {
      return;
    }

    const [type, event, payload] = JSON.parse(data) as ValorantWebsocketMessage;

    if (type === MESSAGE_TYPES.Event) {
      this.emit(event, payload);
      this.emit("event", payload);
    }
  }
}
