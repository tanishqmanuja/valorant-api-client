import { z } from "zod";
import { WebSocket, MessageEvent } from "ws";
import { EVENTS } from "./types/events";
import {
  ValorantWsEvent,
  MESSAGE_TYPES,
  ValorantWebsocketMessage,
  ValorantWebsocketPayload,
  WsEvent,
  BasicWsEvent,
  ValorantWsFunction,
  ListenerMap,
} from "./types";
import { randomUUID } from "crypto";
import { promiseTimeout } from "~/utils/promises";

export const valorantWsClientOptionsSchema = z.object({
  port: z.string(),
  username: z.string().default("riot"),
  password: z.string(),
  host: z.string().default("127.0.0.1"),
  events: z.enum(EVENTS).array().default([]),
});

export type ValorantWsClientOptions = z.input<
  typeof valorantWsClientOptionsSchema
>;

export class ValorantWebsocketClient {
  #options: Required<ValorantWsClientOptions>;
  #connection: WebSocket;
  #subscriptions: Set<ValorantWsEvent> = new Set();

  constructor(options: ValorantWsClientOptions) {
    this.#options = valorantWsClientOptionsSchema.parse(options);
    const { port, username, password, host, events } = this.#options;

    const url = `wss://${username}:${password}@${host}:${port}`;
    this.#connection = new WebSocket(url, {
      rejectUnauthorized: false,
    });

    this.setup(events);
  }

  private setup(events: ValorantWsEvent[] = [], bindOnMessage = true): void {
    events.forEach(event => this.#subscriptions.add(event));

    if (bindOnMessage) {
      this.#connection.on("message", this.onMessage.bind(this));
    }

    this.#connection.once("open", this.onceOpen.bind(this));
  }

  reconnect(options?: ValorantWsClientOptions): void {
    const listenerMap = this.disconnect();

    this.#options = valorantWsClientOptionsSchema.parse({
      ...this.#options,
      ...options,
    });
    const { port, username, password, host, events } = this.#options;

    const url = `wss://${username}:${password}@${host}:${port}`;
    this.#connection = new WebSocket(url, {
      rejectUnauthorized: false,
    });

    [...listenerMap.entries()].forEach(([eventName, listeners]) => {
      listeners.forEach(listener => {
        this.#connection.addListener(
          eventName,
          listener as (...args: any[]) => void,
        );
      });
    });

    this.setup(events, false);
  }

  disconnect(): ListenerMap {
    const listenerMap = new Map<string | symbol, Function[]>();
    this.#connection.eventNames().forEach(eventName => {
      listenerMap.set(eventName, this.#connection.listeners(eventName));
    });

    try {
      this.#connection.removeAllListeners();
      this.#connection.terminate();
    } catch {}

    return listenerMap;
  }

  subscribe(event: ValorantWsEvent): void {
    if (this.#subscriptions.has(event)) {
      return;
    }

    this.#subscriptions.add(event);
    if (this.#connection.readyState === WebSocket.OPEN) {
      this.#connection.send(JSON.stringify([MESSAGE_TYPES.Subscribe, event]));
    }
  }

  unsubscribe(event: ValorantWsEvent): void {
    if (!this.#subscriptions.has(event)) {
      return;
    }

    this.#subscriptions.delete(event);
    if (this.#connection.readyState === WebSocket.OPEN) {
      this.#connection.send(JSON.stringify([MESSAGE_TYPES.Unsubscribe, event]));
    }
  }

  on<T = unknown>(
    event: ValorantWsEvent,
    callback: (payload: ValorantWebsocketPayload<T>) => void,
  ): void;
  on<T = unknown>(event: BasicWsEvent, callback: (payload: T) => void): void;
  on<T = unknown>(event: WsEvent, callback: (payload: T) => void): void {
    this.#connection.on(event, callback);
  }

  once<T = unknown>(
    event: ValorantWsEvent,
    callback: (payload: ValorantWebsocketPayload<T>) => void,
  ): void;
  once<T = unknown>(event: BasicWsEvent, callback: (payload: T) => void): void;
  once<T = unknown>(event: WsEvent, callback: (payload: T) => void): void {
    this.#connection.once(event, callback);
  }

  removeAllListeners(evet?: WsEvent) {
    this.#connection.removeAllListeners(event);
  }

  async call<T = any>(
    fn: ValorantWsFunction,
    opts: {
      data?: any;
      timeoutMs?: number;
    } = {},
  ): Promise<T> {
    const uuid = randomUUID();

    let listener: (event: MessageEvent) => void;

    const promise = new Promise<T>((resolve, reject) => {
      this.#connection.send(
        JSON.stringify([MESSAGE_TYPES.Call, uuid, fn, opts.data]),
      );

      listener = (e: MessageEvent) => {
        const message = e.data.toString();
        if (!message.length) {
          return;
        }

        const [type, event, payload] = JSON.parse(
          message,
        ) as ValorantWebsocketMessage<T>;

        if (
          type === MESSAGE_TYPES.CallResult ||
          type === MESSAGE_TYPES.CallError
        ) {
          if (event !== uuid) {
            return;
          }

          const success = type === MESSAGE_TYPES.CallResult;
          if (success) {
            resolve(payload as any);
          } else {
            reject(payload);
          }
        }
      };

      this.#connection.addEventListener("message", listener.bind(this));
    });

    return promiseTimeout(promise, opts.timeoutMs ?? 5000).finally(() => {
      if (listener) {
        this.#connection.removeListener("message", listener);
      }
    });
  }

  private onceOpen(): void {
    this.#subscriptions.forEach(event =>
      this.#connection.send(JSON.stringify([MESSAGE_TYPES.Subscribe, event])),
    );
  }

  private onMessage(message: string): void {
    if (!message.length) {
      return;
    }

    const [type, event, payload] = JSON.parse(
      message,
    ) as ValorantWebsocketMessage;

    if (type === MESSAGE_TYPES.Event) {
      this.#connection.emit(event, payload);
    }
  }
}
