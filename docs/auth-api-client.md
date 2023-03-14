# Auth API Client

Api wrapper for calling authentication endpoints.

## Options

- `ciphers`<code style="background-color: #7286D3">optional</code>: string[]
- `userAgent`<code style="background-color: #7286D3">optional</code>: string

## Usage

```typescript
const { api: authApi } = createAuthApiClient();

const cookieResponse = await authApi.postAuthCookies({
  data: {
    client_id: "play-valorant-web-prod",
    nonce: "1",
    redirect_uri: "https://playvalorant.com/opt_in",
    response_type: "token id_token",
    scope: "account openid",
  },
});
```
