import { CHALLENGE_IDS, getChallenge, getChallengeIds } from "@/content/desafio-relampago";
import { createChallengeGame } from "@/games/challenge-turns/logic";

export {
  createSession,
  DIFFICULTY_OPTIONS,
  getTotals,
  type Action,
  type DifficultyOption,
  type Game,
  type Outcome,
  type Phase,
  type Session,
  type Tally,
} from "@/games/challenge-turns/logic";

export const SLUG = "desafio-relampago";

export const { reduceSession, isSession, sessionStore } = createChallengeGame(
  {
    ids: CHALLENGE_IDS,
    getIds: getChallengeIds,
    getTimerSeconds: (id) => getChallenge(id)?.timerSeconds,
  },
  "calesita:desafio-relampago",
);
