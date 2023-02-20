// JUST FOR REFERENCE FILE

// import axios from "axios";
// import { pipe } from "fp-ts/lib/function";
// import { Agent } from "node:https";
// import { objectEntries } from "ts-extras";
// import { ValorantEndpoint } from "valorant-api-types";
// import {
//   getArgsMap,
//   getArgsZodSchema,
//   replaceSuffixArgs,
// } from "./helpers/endpoint.js";
// import { createAuthRefreshInterceptor } from "./utils/lib/axios/auth-refesh-interceptor.js";
// import { createRateLimitInterceptor } from "./utils/lib/axios/rate-limit-interceptor.js";
// import { removeAllSpace, toCamelCase } from "./utils/string.js";

// function getValorantAxios() {
//   const axiosInstance = axios.create({
//     httpsAgent: new Agent({
//       rejectUnauthorized: false,
//     }),
//   });

//   createRateLimitInterceptor(axiosInstance, { count: 6, interval: 1000 });
//   createAuthRefreshInterceptor(axiosInstance, {
//     statusCodes: [400],
//     onRefresh: error => console.log("hi"),
//   });

//   return axiosInstance;
// }

// export function getFunctionName(endpoint: ValorantEndpoint) {
//   const { method = "GET", name } = endpoint;
//   return pipe(`${method.toLowerCase()} ${name}`, toCamelCase, removeAllSpace);
// }

// export function generateFunction(endpoint: ValorantEndpoint) {
//   return (suffixArgs: Record<string, string>) => {
//     const argsMap = getArgsMap(endpoint.suffix);
//     const argsSchema = getArgsZodSchema(argsMap);
//     const args = argsSchema.parse(suffixArgs);
//     const suffix = replaceSuffixArgs(endpoint.suffix, args, argsMap);
//   };
// }

// export function createValorantApiClient(
//   endpoints: Record<string, ValorantEndpoint>
// ) {
//   const axios = getValorantAxios();

//   return objectEntries(endpoints).reduce((api, [key, endpoint]) => {
//     const functionName = getFunctionName(endpoint);
//     api[functionName] = generateFunction(endpoint);
//     return api;
//   }, {} as Record<string, any>);
// }
