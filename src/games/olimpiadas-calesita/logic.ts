import { EVENT_IDS, getEvent } from "@/content/olimpiadas-calesita";
import { createRoundsGame } from "@/games/rounds/logic";

export const SLUG = "olimpiadas-calesita";

export const { reduceSession, isSession, sessionStore } = createRoundsGame(
  { cardIds: EVENT_IDS, getTimerSeconds: (id) => getEvent(id)?.timerSeconds },
  "calesita:olimpiadas-calesita",
);
