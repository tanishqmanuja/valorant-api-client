import inquirer from "inquirer";

import {
  createValorantApiClient,
  useProviders,
  provideAuthAutoRegion,
  type MfaCodeProvider,
  provideClientVersionViaVAPI,
} from "~/index.js";

const RIOT_USERNAME = process.env.RIOT_USERNAME;
const RIOT_PASSWORD = process.env.RIOT_PASSWORD;

if (!(RIOT_USERNAME && RIOT_PASSWORD)) {
  console.log("Error: Provide username and password");
  console.log("Either edit the script or use ENV variables.");
  console.log(
    `For setting ENV variables in Powershell use,\n($env:RIOT_USERNAME="123") -and ($env:RIOT_PASSWORD="XYZ")`
  );
  process.exit(1);
}

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
  remote: useProviders([
    provideAuthAutoRegion(RIOT_USERNAME, RIOT_PASSWORD, provideMfaCodeFromCli),
    provideClientVersionViaVAPI(),
  ]),
});

const puuid = vapic.remote.puuid;

const { data: compUpdates } = await vapic.remote.api.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
