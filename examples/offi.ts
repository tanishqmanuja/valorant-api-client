import { createOffiApiClient } from "~/clients";

const offiApiClient = createOffiApiClient();
const { data: maps } = await offiApiClient.fetch("maps");

console.log("maps?", maps);
