import { createValorantApiClient } from "~/index.js";

const vapic = await createValorantApiClient({});

const { data: weapons } = await vapic.offi.fetch("weapons");

console.log("weapons?", weapons);
