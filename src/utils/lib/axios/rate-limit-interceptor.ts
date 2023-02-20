import { AxiosInstance, AxiosRequestConfig } from "axios";
import { Subject, tap } from "rxjs";
import { losslessRateLimit } from "../rxjs/lossless-rate-limit.js";

export type RateLimitOptions = {
  count: number;
  interval: number;
};

export type AxiosRateLimitRequestConfig = AxiosRequestConfig & {
  bypassRateLimit?: boolean;
};

type LazyResolve = () => void;

export function createRateLimitInterceptor(
  axiosInstance: AxiosInstance,
  options: RateLimitOptions
) {
  const queue = new Subject<LazyResolve>();
  const subscription = queue
    .pipe(
      losslessRateLimit(options.count, options.interval),
      tap(lazy => lazy())
    )
    .subscribe();

  const interceptorId = axiosInstance.interceptors.request.use(config => {
    const { bypassRateLimit = false } = config as AxiosRateLimitRequestConfig;

    if (bypassRateLimit) {
      return Promise.resolve(config);
    }

    return new Promise(resolve => {
      queue.next(() => resolve(config));
    });
  });

  return {
    get id() {
      return interceptorId;
    },
    eject: () => {
      subscription.unsubscribe();
      axiosInstance.interceptors.request.eject(interceptorId);
    },
  };
}
