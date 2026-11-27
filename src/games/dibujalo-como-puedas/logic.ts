import { DRAWING_IDS } from "@/content/dibujalo-como-puedas";
import { createTeamTurnGame } from "@/games/team-turns/logic";

export const SLUG = "dibujalo-como-puedas";

export const { reduceSession, isSession, sessionStore } = createTeamTurnGame(
  DRAWING_IDS,
  "calesita:dibujalo-como-puedas",
);
