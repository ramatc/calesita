import { WORD_IDS } from "@/content/palabras-prohibidas";
import { createTeamTurnGame } from "@/games/team-turns/logic";

export const SLUG = "palabras-prohibidas";

export const { reduceSession, isSession, sessionStore } = createTeamTurnGame(
  WORD_IDS,
  "calesita:palabras-prohibidas",
);
