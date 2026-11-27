import { CHALLENGE_IDS, getChallenge, getChallengeIds } from "@/content/mentira-o-verdad";
import { createChallengeGame } from "@/games/challenge-turns/logic";

export const SLUG = "mentira-o-verdad";

export const { reduceSession, isSession, sessionStore } = createChallengeGame(
  {
    ids: CHALLENGE_IDS,
    getIds: getChallengeIds,
    getTimerSeconds: (id) => getChallenge(id)?.timerSeconds,
  },
  "calesita:mentira-o-verdad",
);
