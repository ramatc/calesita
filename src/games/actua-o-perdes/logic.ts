import { PROMPT_IDS } from "@/content/actua-o-perdes";
import { createDeck, drawCard, isDeck, type Deck } from "@/games/deck";
import { addTeamPoint, createPlayers, createTeams, isTeam, type Team } from "@/games/players";
import { createPersistentStore } from "@/lib/storage";
import {
  createTimer,
  getRemainingMs,
  isTimer,
  pauseTimer,
  startTimer,
  type Timer,
} from "@/lib/timer";

const PHASES = ["handoff", "acting", "summary", "finished"] as const;

export const TURN_SECONDS_OPTIONS = [30, 60, 90] as const;
export const ROUNDS_OPTIONS = [2, 3, 5] as const;
export const DEFAULT_TURN_SECONDS = 60;
export const DEFAULT_ROUNDS = 3;

export type Phase = (typeof PHASES)[number];
export type TurnSeconds = (typeof TURN_SECONDS_OPTIONS)[number];
export type Rounds = (typeof ROUNDS_OPTIONS)[number];

export type Game = {
  players: number;
  teams: Team[];
  turnSeconds: TurnSeconds;
  totalRounds: Rounds;
  /** 1-based; a round means both teams played one turn. */
  round: number;
  /** Index in teams of the team playing the current turn. */
  turnIndex: 0 | 1;
  phase: Phase;
  /** Only set while acting, so the prompt cannot leak before the handoff. */
  promptId: string | null;
  turnPoints: number;
  timer: Timer;
};

/** The deck lives outside the game, so a new game keeps avoiding repeats. */
export type Session = {
  deck: Deck;
  game: Game | null;
};

export type Action =
  | {
      type: "start";
      players: number;
      teamNames: readonly string[];
      turnSeconds: TurnSeconds;
      rounds: Rounds;
    }
  | { type: "begin-turn"; now: number }
  | { type: "hit"; now: number }
  | { type: "pass"; now: number }
  | { type: "pause"; now: number }
  | { type: "resume"; now: number }
  | { type: "expire"; now: number }
  | { type: "next-turn" }
  | { type: "end" };

export function createSession(): Session {
  return { deck: createDeck(), game: null };
}

export function getTurnTeam(game: Game): Team {
  return game.teams[game.turnIndex];
}

/** Whether the turn being played or summarized is the last one of the game. */
export function isLastTurn(game: Game): boolean {
  return game.round === game.totalRounds && game.turnIndex === game.teams.length - 1;
}

function dealPrompt(deck: Deck) {
  const { deck: nextDeck, cardId } = drawCard(deck, PROMPT_IDS);
  return { deck: nextDeck, promptId: cardId };
}

function endTurn(session: Session, game: Game): Session {
  return {
    ...session,
    game: { ...game, phase: "summary", promptId: null, timer: createTimer(game.turnSeconds) },
  };
}

/** Hit and pass share everything but the point. The timer decides first, so a late tap scores nothing. */
function nextPrompt(session: Session, game: Game, now: number, points: 0 | 1): Session {
  if (game.phase !== "acting" || game.timer.deadlineMs === null) return session;
  if (getRemainingMs(game.timer, now) === 0) return endTurn(session, game);

  const { deck, promptId } = dealPrompt(session.deck);
  const teams = points ? addTeamPoint(game.teams, getTurnTeam(game).id) : game.teams;
  return { deck, game: { ...game, teams, promptId, turnPoints: game.turnPoints + points } };
}

export function reduceSession(session: Session, action: Action): Session {
  const { game } = session;

  if (action.type === "start") {
    if (game && game.phase !== "finished") return session;
    return {
      ...session,
      game: {
        players: action.players,
        teams: createTeams(createPlayers(action.players), action.teamNames),
        turnSeconds: action.turnSeconds,
        totalRounds: action.rounds,
        round: 1,
        turnIndex: 0,
        phase: "handoff",
        promptId: null,
        turnPoints: 0,
        timer: createTimer(action.turnSeconds),
      },
    };
  }

  if (!game) return session;

  switch (action.type) {
    case "begin-turn": {
      if (game.phase !== "handoff") return session;
      const { deck, promptId } = dealPrompt(session.deck);
      return {
        deck,
        game: {
          ...game,
          phase: "acting",
          promptId,
          turnPoints: 0,
          timer: startTimer(createTimer(game.turnSeconds), action.now),
        },
      };
    }
    case "hit":
      return nextPrompt(session, game, action.now, 1);
    case "pass":
      return nextPrompt(session, game, action.now, 0);
    case "pause":
      if (game.phase !== "acting" || game.timer.deadlineMs === null) return session;
      if (getRemainingMs(game.timer, action.now) === 0) return endTurn(session, game);
      return { ...session, game: { ...game, timer: pauseTimer(game.timer, action.now) } };
    case "resume":
      if (game.phase !== "acting" || game.timer.deadlineMs !== null) return session;
      return { ...session, game: { ...game, timer: startTimer(game.timer, action.now) } };
    case "expire":
      if (game.phase !== "acting" || game.timer.deadlineMs === null) return session;
      return getRemainingMs(game.timer, action.now) === 0 ? endTurn(session, game) : session;
    case "next-turn":
      if (game.phase !== "summary") return session;
      if (isLastTurn(game)) return { ...session, game: { ...game, phase: "finished" } };
      return {
        ...session,
        game: {
          ...game,
          phase: "handoff",
          round: game.turnIndex === 1 ? game.round + 1 : game.round,
          turnIndex: game.turnIndex === 1 ? 0 : 1,
        },
      };
    case "end":
      return { ...session, game: null };
  }
}

function isPromptValid(game: Partial<Game>): boolean {
  return game.phase === "acting"
    ? PROMPT_IDS.some((id) => id === game.promptId)
    : game.promptId === null;
}

function isGame(value: unknown): value is Game {
  if (typeof value !== "object" || value === null) return false;
  const game = value as Partial<Game>;
  return (
    typeof game.players === "number" &&
    Array.isArray(game.teams) &&
    game.teams.length === 2 &&
    game.teams.every(isTeam) &&
    TURN_SECONDS_OPTIONS.some((seconds) => seconds === game.turnSeconds) &&
    ROUNDS_OPTIONS.some((rounds) => rounds === game.totalRounds) &&
    typeof game.round === "number" &&
    game.round >= 1 &&
    game.round <= (game.totalRounds ?? 0) &&
    (game.turnIndex === 0 || game.turnIndex === 1) &&
    PHASES.some((phase) => phase === game.phase) &&
    isPromptValid(game) &&
    typeof game.turnPoints === "number" &&
    isTimer(game.timer) &&
    game.timer.durationMs === (game.turnSeconds ?? 0) * 1000
  );
}

export function isSession(value: unknown): value is Session {
  if (typeof value !== "object" || value === null) return false;
  const session = value as Partial<Session>;
  return isDeck(session.deck) && (session.game === null || isGame(session.game));
}

export const sessionStore = createPersistentStore<Session>({
  key: "calesita:actua-o-perdes",
  version: 1,
  fallback: createSession(),
  validate: isSession,
});
