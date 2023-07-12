import inquirer from "inquirer";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { CookieJar } from "tough-cookie";
import { FileCookieStore } from "tough-cookie-file-store";

import {
  provideClientVersionViaVAPI,
  provideAuth,
  createValorantApiClient,
  provideRegion,
  useProviders,
  type MfaCodeProvider,
} from "~/index.js";

const RIOT_USERNAME = process.env.RIOT_USERNAME;
const RIOT_PASSWORD = process.env.RIOT_PASSWORD;

// change as per your requirement
const REGION = "ap";
const SHARD = "ap";

if (!(RIOT_USERNAME && RIOT_PASSWORD)) {
  console.log("Error: Provide username and password");
  console.log("Either edit the script or use ENV variables.");
  console.log(
    `For setting ENV variables in Powershell use,\n($env:RIOT_USERNAME="123") -and ($env:RIOT_PASSWORD="XYZ")`
  );
  process.exit(1);
}

const COOKIE_STORE_FILEPATH = ".cache/cookies.json";
mkdir(dirname(COOKIE_STORE_FILEPATH), { recursive: true }); // make sure the directory exists

// MFA provider function

const provideMfaCodeFromCli: MfaCodeProvider = async response => {
  const { code } = await inquirer.prompt({
    type: "input",
    name: "code",
    message:
      "Enter MFA code" + response
        ? `(email: ${response?.data.multifactor.email})`
        : "",
  });

  return {
    code,
  };
};

// main code starts here ...

const vapic = await createValorantApiClient({
  auth: {
    cookieJar: new CookieJar(new FileCookieStore(COOKIE_STORE_FILEPATH)),
  },
  remote: useProviders([
    provideClientVersionViaVAPI(),
    provideRegion(REGION, SHARD),
    provideAuth(RIOT_USERNAME, RIOT_PASSWORD, provideMfaCodeFromCli),
  ]),
});

const puuid = vapic.remote.puuid;

const { data: compUpdates } = await vapic.remote.api.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
