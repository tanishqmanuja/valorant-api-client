import { expect, test } from "bun:test";

import { getLockFileData } from "~/file-parsers/lockfile";
import { getLogFileData } from "~/file-parsers/logfile";

const resolve = (path: string) => Bun.fileURLToPath(import.meta.resolve(path));

const LOCK_FILE_PATH = resolve("./assets/lockfile");
const LOG_FILE_PATH = resolve("./assets/ShooterGame.log");

const LOCK_DATA = {
  password: "7wufcqjEMqXxtcvtX6znJQ",
  pid: "5612",
  port: "64656",
  protocol: "https",
  user: "Riot Client",
};

test("Lockfile parsing", async () => {
  const data = await getLockFileData(LOCK_FILE_PATH);
  expect(data).toEqual(LOCK_DATA);
});

const LOG_DATA = {
  clientVersion: "release-07.12-shipping-15-2164217",
  servers: {
    glz: "https://glz-ap-1.ap.a.pvp.net",
    pd: "https://pd.ap.a.pvp.net",
    shared: "https://shared.ap.a.pvp.net",
  },
};

test("Logfile parsing", async () => {
  const data = await getLogFileData(LOG_FILE_PATH);
  expect(data).toEqual(LOG_DATA);
});
