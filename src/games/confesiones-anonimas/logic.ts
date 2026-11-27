import { TOPIC_IDS } from "@/content/confesiones-anonimas";
import { createRoundsGame } from "@/games/rounds/logic";

export const SLUG = "confesiones-anonimas";

export const { reduceSession, isSession, sessionStore } = createRoundsGame(
  { cardIds: TOPIC_IDS, getTimerSeconds: () => undefined },
  "calesita:confesiones-anonimas",
);
