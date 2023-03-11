import {
  createRateLimitInterceptor,
  createRetryInterceptor,
  createAuthRefreshInterceptor,
} from "@tqman/axios-interceptor-suite/interceptors";

import {
  createValorantApiClient,
  getAccessTokenHeader,
  getEntitlementsJWTHeader,
  provideLockFile,
  provideLogFile,
  provideRemoteAuthViaLocalApi,
} from "~/index.js";

// Create Valorant API Client

const vapic = await createValorantApiClient({
  local: {
    providers: [provideLockFile()],
  },
  remote: {
    providers: [provideLogFile(), provideRemoteAuthViaLocalApi()],
  },
});

// Modify API Client fetching behaviour

const localAxiosInstance = vapic.local.getAxiosInstance();
const remoteAxiosInstance = vapic.remote.getAxiosInstance();

createRateLimitInterceptor(localAxiosInstance, {
  count: 10,
  interval: 1 * 1000,
});

createRateLimitInterceptor(remoteAxiosInstance, {
  count: 6,
  interval: 1 * 1000,
});

createRetryInterceptor(remoteAxiosInstance, { count: 2, delay: 1 * 1000 });

createAuthRefreshInterceptor(remoteAxiosInstance, {
  statusCodes: [400],
  onRefresh: async error => {
    const authProvider = provideRemoteAuthViaLocalApi();

    const { accessToken, entitlementsToken } = await authProvider(
      vapic.getRemoteContext()
    );

    const headers = {
      ...getAccessTokenHeader(accessToken),
      ...getEntitlementsJWTHeader(entitlementsToken),
    };

    // Set for whole instance
    vapic.remote.setTokens({ accessToken, entitlementsToken });

    // Set for this request
    if (error.response) {
      error.response.config.headers = Object.assign(
        error.response.config.headers,
        headers
      );

      return Promise.resolve(error);
    }

    Promise.reject(error);
  },
});

// Use API Client

const puuid = vapic.remote.getPuuid();

const { data: compUpdates } = await vapic.remote.api.getCompetitiveUpdates({
  data: {
    puuid,
  },
});

console.log(compUpdates);
