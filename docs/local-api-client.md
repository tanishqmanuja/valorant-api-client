# Local API Client

Api wrapper for calling local endpoints.

> Can only be used while your RiotClientServices.exe is running.

## Options

- `port` <code style="background-color: #FD8A8A">required</code>: string
- `password` <code style="background-color: #FD8A8A">required</code>: string
- `username` <code style="background-color: #7286D3">optional</code>: string
- `zodParseResponse` <code style="background-color: #7286D3">optional</code>: boolean

## Usage

```typescript
const lockfile = await getLockFileDataPromise();

if (lockfile) {
  const { password, port } = lockfile;
  const { api: localAPI } = createLocalApiClient({
    password,
    port,
  });

  const {
    data: { accessToken, token: entitlementsToken, subject: selfPuuid },
  } = await localAPI.getEntitlementsToken();

  console.log("PUUID", selfPuuid);
}
```
