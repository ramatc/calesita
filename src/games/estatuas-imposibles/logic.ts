import { CHALLENGE_IDS, getChallenge, getChallengeIds } from "@/content/estatuas-imposibles";
import { createChallengeGame } from "@/games/challenge-turns/logic";

export const SLUG = "estatuas-imposibles";

export const { reduceSession, isSession, sessionStore } = createChallengeGame(
  {
    ids: CHALLENGE_IDS,
    getIds: getChallengeIds,
    getTimerSeconds: (id) => getChallenge(id)?.timerSeconds,
  },
  "calesita:estatuas-imposibles",
);
