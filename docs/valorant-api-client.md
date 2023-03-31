# Valorant API Client

Wrapper around the 3 API Clients (Auth, Local, Remote).

## Options

- `auth`: AuthApiClientOptions

  - Minimum Requirements: <code style="background-color: #65647C">none</code>

- `local`: LocalApiClientOptions OR useProvider Function(recommended)

  - Minimum Requirements: <code style="background-color: #FD8A8A">password</code> <code style="background-color: #FD8A8A">port</code>

- `remote`: RemoteApiClientOptions OR useProvider Function(recommended)
  - Minimum Requirements: <code style="background-color: #FD8A8A">accessToken</code> <code style="background-color: #FD8A8A">entitlementsToken</code> <code style="background-color: #AC7088">shard</code> <code style="background-color: #AC7088">region</code> <code style="background-color: #54BAB9">clientVersion</code>

## Provider System

Since most parameters for initializing API Client/s can be gathered with various functions, It is baseless to hard-code them or provide manually.

```typescript
const vapic = await createValorantApiClient({
  local: useProviders([...localProviders]),
  remote: useProviders([...remoteProviders]),
});
```

> All the providers within a single useProvider() when combined should fulfill atleast the minimum requirements of the respective API Client/s.

## Available Providers

- ### provideLockFile

  Input: <code style="background-color: #B08BBB">lockfilePath(optional)</code> \
  Output: <code style="background-color: #FD8A8A">password</code> <code style="background-color: #FD8A8A">port</code> \
  Used As: `LocalApiClientProvider`

- ### provideLogFile

  Input: <code style="background-color: #B08BBB">logfilePath(optional)</code> \
  Output: <code style="background-color: #AC7088">shard</code> <code style="background-color: #AC7088">region</code> <code style="background-color: #54BAB9">clientVersion</code> \
  Used As: `RemoteApiClientProvider`

- ### provideAuth

  Input: <code style="background-color: #7286D3">username</code> <code style="background-color: #7286D3">password</code> <code style="background-color: #7286D3">mfaCodeProvider(optional)</code>\
  Output: <code style="background-color: #FD8A8A">accessToken</code> <code style="background-color: #FD8A8A">entitlementsToken</code> \
  Used As: `RemoteApiClientProvider`

- ### provideAuthViaLocalApi

  Input: <code style="background-color: #65647C">none</code> \
  Output: <code style="background-color: #FD8A8A">accessToken</code> <code style="background-color: #FD8A8A">entitlementsToken</code> \
  Used As: `RemoteApiClientProvider`

- ### provideRegion

  Input: <code style="background-color: #7286D3">region</code> <code style="background-color: #7286D3">shard</code> \
  Output: <code style="background-color: #AC7088">region</code> <code style="background-color: #AC7088">shard</code> \
  Used As: `RemoteApiClientProvider`

- ### provideClientVersionViaVAPI

  Input: <code style="background-color: #65647C">none</code> \
  Output: <code style="background-color: #54BAB9">clientVersion</code> \
  Used As: `RemoteApiClientProvider`

- ### provideAuthAutoRegion

  Input: <code style="background-color: #7286D3">username</code> <code style="background-color: #7286D3">password</code> <code style="background-color: #7286D3">mfaCodeProvider(optional)</code>\
  Output: <code style="background-color: #FD8A8A">accessToken</code> <code style="background-color: #FD8A8A">entitlementsToken</code> <code style="background-color: #AC7088">region</code> <code style="background-color: #AC7088">shard</code> <code style="background-color: #54BAB9">clientVersion</code> \
  Used As: `RemoteApiClientProvider`

## Usage

Setup using Local API Client

```typescript
const vapic = await createValorantApiClient({
  local: useProviders([provideLockFile()]),
  remote: useProviders([provideLogFile(), provideAuthViaLocalApi()]),
});

// Use API Client

const puuid = vapic.remote.getPuuid();

const { data: compUpdates } = await vapic.remote.api.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
```

Setup using Remote API Client

```typescript
// change as per your requirement
const RIOT_USERNAME = "RIOT_USERNAME";
const RIOT_PASSWORD = "RIOT_PASSWORD";
const REGION = "REGION";
const SHARD = "SHARD";

// main code starts here ...
const vapic = await createValorantApiClient({
  remote: useProviders([
    provideClientVersionViaVAPI(),
    provideRegion(REGION, SHARD),
    provideAuth(RIOT_USERNAME, RIOT_PASSWORD),
  ]),
});

const puuid = vapic.remote.getPuuid();

const { data: compUpdates } = await vapic.remote.api.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
```

Setup using Remote API Client + MFA + Automatic region detection

```typescript
// change as per your requirement
const RIOT_USERNAME = "RIOT_USERNAME";
const RIOT_PASSWORD = "RIOT_PASSWORD";

// mfaCodeProvider using inquirer.js
const provideMfaCodeFromCli: MfaCodeProvider = async response => {
  const { code } = await inquirer.prompt({
    type: "input",
    name: "code",
    message: `Enter MFA code (email: ${response.data.multifactor.email})`,
  });

  return {
    code,
  };
};

// main code starts here ...
const vapic = await createValorantApiClient({
  remote: useProviders([
    provideAuthAutoRegion(RIOT_USERNAME, RIOT_PASSWORD, provideMfaCodeFromCli),
  ]),
});

const puuid = vapic.remote.getPuuid();

const { data: compUpdates } = await vapic.remote.api.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
```
