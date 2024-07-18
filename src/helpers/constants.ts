import { join } from "node:path";

import type { PlatformInfo } from "./types";

export const LOG_FILE_PATH = join(
  process.env.LOCALAPPDATA ?? "",
  "VALORANT",
  "Saved",
  "Logs",
  "ShooterGame.log",
);

export const LOCK_FILE_PATH = join(
  process.env.LOCALAPPDATA ?? "",
  "Riot Games",
  "Riot Client",
  "Config",
  "lockfile",
);

export const DEFAULT_PLATFORM_INFO: PlatformInfo = {
  platformType: "PC",
  platformOS: "Windows",
  platformOSVersion: "10.0.19044.1.256.64bit",
  platformChipset: "Unknown",
};

export const DEFAULT_USER_AGENT =
  "ShooterGame/13 Windows/10.0.19044.1.256.64bit";

export const DEFAULT_CIPHERS = [
  "ECDHE-ECDSA-CHACHA20-POLY1305",
  "ECDHE-RSA-CHACHA20-POLY1305",
  "ECDHE-ECDSA-AES128-GCM-SHA256",
  "ECDHE-RSA-AES128-GCM-SHA256",
  "ECDHE-ECDSA-AES256-GCM-SHA384",
  "ECDHE-RSA-AES256-GCM-SHA384",
  "ECDHE-ECDSA-AES128-SHA",
  "ECDHE-RSA-AES128-SHA",
  "ECDHE-ECDSA-AES256-SHA",
  "ECDHE-RSA-AES256-SHA",
  "AES128-GCM-SHA256",
  "AES256-GCM-SHA384",
  "AES128-SHA",
  "AES256-SHA",
  "DES-CBC3-SHA",
  "TLS_CHACHA20_POLY1305_SHA256",
  "TLS_AES_128_GCM_SHA256",
  "TLS_AES_256_GCM_SHA384",
];

export const DEFAULT_SIGALGS = [
  "ecdsa_secp256r1_sha256",
  "rsa_pss_rsae_sha256",
  "rsa_pkcs1_sha256",
  "ecdsa_secp384r1_sha384",
  "rsa_pss_rsae_sha384",
  "rsa_pkcs1_sha384",
  "rsa_pss_rsae_sha512",
  "rsa_pkcs1_sha512",
  "rsa_pkcs1_sha1",
];

export const DEFAULT_RSO_USER_AGENT =
  "RiotClient/90.0.2.1805.3774 rso-auth (Windows;10;;Professional, x64)";
