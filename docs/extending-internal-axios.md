# Extending Internal Axios Instance with Interceptors

All API Clients expose the internal axios instance. You can use the following methods to extend the internal axios instance.

```ts
import { createValorantApiClient } from "@tqman/valorant-api-client";
import { LOCAL_CONFIG } from "@tqman/valorant-api-client/default-configs";
import { createRateLimitInterceptor } from "@tqman/axios-interceptor-suite";

const vapic = await createValorantApiClient(LOCAL_CONFIG);

const localAxiosInstance = vapic.local.axiosInstance;
const remoteAxiosInstance = vapic.remote.axiosInstance;

createRateLimitInterceptor(localAxiosInstance, {
  count: 10,
  interval: 1 * 1000,
});

createRateLimitInterceptor(remoteAxiosInstance, {
  count: 6,
  interval: 1 * 1000,
});

// Use API Client
const puuid = vapic.remote.puuid;
const { data: compUpdates } = await vapic.remote.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
```
