import type { z } from "zod";

import type { platformSchema } from "~/endpoints/common-types";

export type PlatformInfo = z.infer<typeof platformSchema>;

type RemoteHeaderOptions = {
  accessToken: string;
  entitlementsToken: string;
  clientVersion: string;
  platformInfo: PlatformInfo;
  userAgent: string;
};

export class HeadersBuilder {
  private headers: Record<string, string> = {};

  static create() {
    return new HeadersBuilder();
  }

  static remote(options: RemoteHeaderOptions) {
    return new HeadersBuilder()
      .accessToken(options.accessToken)
      .entitlementsJWT(options.entitlementsToken)
      .clientVersion(options.clientVersion)
      .clientPlatform(options.platformInfo)
      .userAgent(options.userAgent)
      .build();
  }

  userAgent(userAgent: string) {
    this.headers["User-Agent"] = userAgent;
    return this;
  }

  rsoUserAgent(clientBuild: string) {
    this.headers["User-Agent"] =
      `RiotClient/${clientBuild} rso-auth (Windows;10;;Professional, x64)`;
    return this;
  }

  localAuth(username: string, password: string) {
    this.headers["Authorization"] =
      `Basic ${generateBasicToken(username, password)}`;
    return this;
  }

  accessToken(accessToken: string) {
    this.headers["Authorization"] = accessToken.startsWith("Bearer")
      ? accessToken
      : `Bearer ${accessToken}`;
    return this;
  }

  entitlementsJWT(entitlementsToken: string) {
    this.headers["X-Riot-Entitlements-JWT"] = entitlementsToken;
    return this;
  }

  clientVersion(clientVersion: string) {
    this.headers["X-Riot-ClientVersion"] = clientVersion;
    return this;
  }

  clientPlatform(platformInfo: PlatformInfo) {
    this.headers["X-Riot-ClientPlatform"] = Buffer.from(
      JSON.stringify(platformInfo),
    ).toString("base64");
    return this;
  }

  build() {
    return this.headers;
  }
}

export const generateBasicToken = (username: string, password: string) =>
  Buffer.from(`${username}:${password}`).toString("base64");
