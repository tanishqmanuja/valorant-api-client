# Auth API Client

Api wrapper for calling authentication endpoints.

## Options

- `ciphers` **(optional)** - string[]
- `userAgent` **(optional)** - string
- `clientVersion` **(REQUIRED)** - string
- `cookieJar` **(optional)** - cookieJar

## Options Type

```ts
type AuthApiClientOptions = {
  ciphers?: string[];
  clientVersion: string;
  userAgent?: string;
  cookieJar?: CookieJar;
};
```

## Usage

```typescript
const clientVersion = await fetchClientVersionFromVAPI();
const auth = new AuthApiClient({ clientVersion });

const cookieResponse = await auth.postAuthCookies({
  data: {
    client_id: "play-valorant-web-prod",
    nonce: "1",
    redirect_uri: "https://playvalorant.com/opt_in",
    response_type: "token id_token",
    scope: "account openid",
  },
});
```
