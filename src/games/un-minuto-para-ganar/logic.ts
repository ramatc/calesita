import { CHALLENGE_IDS, getChallenge, getChallengeIds } from "@/content/un-minuto-para-ganar";
import { createChallengeGame } from "@/games/challenge-turns/logic";

export const SLUG = "un-minuto-para-ganar";

export const { reduceSession, isSession, sessionStore } = createChallengeGame(
  {
    ids: CHALLENGE_IDS,
    getIds: getChallengeIds,
    getTimerSeconds: (id) => getChallenge(id)?.timerSeconds,
  },
  "calesita:un-minuto-para-ganar",
);
