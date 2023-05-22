import { z } from "zod";

import { EVENTS } from "./events.autogen.js";
import { MESSAGE_TYPES, ValorantWSEE } from "./types.js";
import { ValorantWebSocket } from "./websocket.js";

export const WsClientOptionsSchema = z.object({
  port: z.string(),
  username: z.string().optional(),
  password: z.string(),
  host: z.string().optional(),
  events: z.enum(EVENTS).array().optional(),
});

export type WsClientOptions = z.infer<typeof WsClientOptionsSchema>;

const DEAFULT_CLIENT_OPTIONS = {
  username: "riot",
  host: "127.0.0.1",
  events: [],
} satisfies Partial<WsClientOptions>;

export function createValorantWebSocket(options: WsClientOptions) {
  const opts: Required<WsClientOptions> = {
    ...DEAFULT_CLIENT_OPTIONS,
    ...options,
  };

  const { port, username, password, host, events } = opts;

  const url = `wss://${username}:${password}@${host}:${port}`;
  const ws = new ValorantWebSocket(url);

  if (events.length > 0) {
    ws.once("open", () => {
      events.forEach(event =>
        ws.send(JSON.stringify([MESSAGE_TYPES.Subscribe, event]))
      );
    });
  }

  // TODO: fix this later.
  return ws as unknown as ValorantWSEE;
}
