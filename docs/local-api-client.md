# Local API Client

Api wrapper for calling local endpoints.

> Can only be used while your RiotClientServices.exe is running.

## Options

- `port` **(REQUIRED)** - string
- `password` **(REQUIRED)** - string
- `username` **(optional)** - string
- `parseResponseData` **(optional)** - boolean

## Options Type

```ts
type LocalApiClientOptions = {
  port: string;
  username?: string;
  password: string;
  parseResponseData?: boolean;
};
```

## Usage

```typescript
const lockfile = await getLockFileData();

if (!lockfile) {
  console.log("Lockfile not found!");
  process.exit(1);
}

const { password, port } = lockfile;
const local = new LocalApiClient({
  password,
  port,
});

const {
  data: { accessToken, token: entitlementsToken, subject: selfPuuid },
} = await local.getEntitlementsToken();

console.log("PUUID", selfPuuid);
```
