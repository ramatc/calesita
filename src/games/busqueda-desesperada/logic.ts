import { getSearch, SEARCH_IDS } from "@/content/busqueda-desesperada";
import { createRoundsGame } from "@/games/rounds/logic";

export const SLUG = "busqueda-desesperada";

export const { reduceSession, isSession, sessionStore } = createRoundsGame(
  { cardIds: SEARCH_IDS, getTimerSeconds: (id) => getSearch(id)?.timerSeconds },
  "calesita:busqueda-desesperada",
);
