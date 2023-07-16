# Auth API Client

Api wrapper for calling authentication endpoints.

## Options

- `ciphers` **(optional)** - string[]
- `rsoUserAgent` **(optional)** - string
- `cookieJar` **(optional)** - cookieJar

## Options Type

```ts
type AuthApiClientOptions = {
  ciphers?: string[];
  rsoUserAgent?: string;
  cookieJar?: CookieJar;
};
```

## Usage

```typescript
const auth = new AuthApiClient();

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
