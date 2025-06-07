import { createValorantApiClient } from "@tqman/valorant-api-client";

const v = await createValorantApiClient({ initializer: "local" });
const { data: help } = await v.local.request("/help")
console.log(help);
