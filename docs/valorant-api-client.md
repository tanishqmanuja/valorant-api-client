# Valorant API Client

Wrapper around the 3 API Clients (Auth, Local, Remote).

## Options

1. `auth`: AuthApiClientOptions

   - Minimum Requirements: **[ none ]**

2. `local`: LocalApiClientOptions OR [VapicProvider](../docs/vapic-providers.md)

   - Minimum Requirements: **[ password, port ]**

3. `remote`: RemoteApiClientOptions OR [VapicProvider](../docs/vapic-providers.md)
   - Minimum Requirements: **[ accessToken, entitlementsToken, shard, region, clientVersion ]**

## Provider System

Since most parameters for initializing API Client/s can be gathered with various functions, It is baseless to hard-code them or provide manually.

```typescript
const vapic = await createValorantApiClient({
  local: useProviders([...localProviders]),
  remote: useProviders([...remoteProviders]),
});
```

More information on providers [here](../docs/vapic-providers.md).

> All the providers within a single useProvider() when combined should fulfill atleast the minimum requirements of the respective API Client/s.

## Usage

### > Setup using Local API Client

```typescript
const vapic = await createValorantApiClient({
  auth: useProviders(provideClientVersionViaVAPI()),
  local: useProviders(provideLockFile()),
  remote: useProviders([provideLogFile(), provideAuthViaLocalApi()]),
});

// Use API Client

const puuid = vapic.remote.puuid;

const { data: compUpdates } = await vapic.remote.api.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
```

### > Setup using Remote API Client

```typescript
// change as per your requirement
const RIOT_USERNAME = "RIOT_USERNAME";
const RIOT_PASSWORD = "RIOT_PASSWORD";
const REGION = "REGION";
const SHARD = "SHARD";

// main code starts here ...
const vapic = await createValorantApiClient({
  auth: useProviders(provideClientVersionViaVAPI()),
  remote: useProviders([
    provideClientVersionViaAuthApi(),
    provideRegion(REGION, SHARD),
    provideAuth(RIOT_USERNAME, RIOT_PASSWORD),
  ]),
});

const puuid = vapic.remote.puuid;

const { data: compUpdates } = await vapic.remote.api.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
```

### > Setup using Remote API Client + MFA + Automatic region detection

```typescript
// change as per your requirement
const RIOT_USERNAME = "RIOT_USERNAME";
const RIOT_PASSWORD = "RIOT_PASSWORD";

// mfaCodeProvider using inquirer.js
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
  auth: useProviders(provideClientVersionViaVAPI()),
  remote: useProviders([
    provideClientVersionViaAuthApi(),
    provideAuthAutoRegion(RIOT_USERNAME, RIOT_PASSWORD, provideMfaCodeFromCli),
  ]),
});

const puuid = vapic.remote.puuid;

const { data: compUpdates } = await vapic.remote.api.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
```
