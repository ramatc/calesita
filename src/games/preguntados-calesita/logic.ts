import { QUESTION_IDS } from "@/content/preguntados-calesita";
import { createRoundsGame } from "@/games/rounds/logic";

export const SLUG = "preguntados-calesita";

export const { reduceSession, isSession, sessionStore } = createRoundsGame(
  { cardIds: QUESTION_IDS, getTimerSeconds: () => undefined },
  "calesita:preguntados-calesita",
);
