import { PROMPT_IDS } from "@/content/actua-o-perdes";
import { createTeamTurnGame } from "@/games/team-turns/logic";

export {
  createSession,
  DEFAULT_ROUNDS,
  DEFAULT_TURN_SECONDS,
  getTurnTeam,
  isLastTurn,
  ROUNDS_OPTIONS,
  TURN_SECONDS_OPTIONS,
  type Action,
  type Game,
  type Phase,
  type Rounds,
  type Session,
  type TurnSeconds,
} from "@/games/team-turns/logic";

export const SLUG = "actua-o-perdes";

export const { reduceSession, isSession, sessionStore } = createTeamTurnGame(
  PROMPT_IDS,
  "calesita:actua-o-perdes",
);
