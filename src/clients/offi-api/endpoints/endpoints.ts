/* THIS IS AN AUTO GENERATED FILE - DO NOT EDIT */
import { AgentsEndpoint } from "./agents";
import { BuddiesEndpoint } from "./buddies";
import { BundlesEndpoint } from "./bundles";
import { CeremoniesEndpoint } from "./ceremonies";
import { CompetitivetiersEndpoint } from "./competitivetiers";
import { ContenttiersEndpoint } from "./contenttiers";
import { ContractsEndpoint } from "./contracts";
import { CurrenciesEndpoint } from "./currencies";
import { EventsEndpoint } from "./events";
import { GamemodesEndpoint } from "./gamemodes";
import { GearEndpoint } from "./gear";
import { LevelbordersEndpoint } from "./levelborders";
import { MapsEndpoint } from "./maps";
import { PlayercardsEndpoint } from "./playercards";
import { PlayertitlesEndpoint } from "./playertitles";
import { SeasonsEndpoint } from "./seasons";
import { SpraysEndpoint } from "./sprays";
import { ThemesEndpoint } from "./themes";
import { VersionEndpoint } from "./version";
import { WeaponsEndpoint } from "./weapons";

export const endpoints = {
  agents: AgentsEndpoint,
  buddies: BuddiesEndpoint,
  bundles: BundlesEndpoint,
  ceremonies: CeremoniesEndpoint,
  competitivetiers: CompetitivetiersEndpoint,
  contenttiers: ContenttiersEndpoint,
  contracts: ContractsEndpoint,
  currencies: CurrenciesEndpoint,
  events: EventsEndpoint,
  gamemodes: GamemodesEndpoint,
  gear: GearEndpoint,
  levelborders: LevelbordersEndpoint,
  maps: MapsEndpoint,
  playercards: PlayercardsEndpoint,
  playertitles: PlayertitlesEndpoint,
  seasons: SeasonsEndpoint,
  sprays: SpraysEndpoint,
  themes: ThemesEndpoint,
  weapons: WeaponsEndpoint,
  version: VersionEndpoint,
};

export type Endpoints = keyof typeof endpoints;
