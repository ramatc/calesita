import { CHALLENGE_IDS, getChallenge, getChallengeIds } from "@/content/desafio-relampago";
import { createDeck, drawCard, isDeck, type Deck } from "@/games/deck";
import { getNextActiveIndex, isPlayer, type Player } from "@/games/players";
import { createPersistentStore } from "@/lib/storage";

export const SLUG = "desafio-relampago";
import {
  createTimer,
  getRemainingMs,
  isTimer,
  pauseTimer,
  startTimer,
  type Timer,
} from "@/lib/timer";

const PHASES = ["idle", "running", "paused", "expired"] as const;

export const DIFFICULTY_OPTIONS = ["easy", "medium", "hard", "mixed"] as const;

export type Phase = (typeof PHASES)[number];

export type DifficultyOption = (typeof DIFFICULTY_OPTIONS)[number];

export type Outcome = "completed" | "failed" | "skipped";

export type Tally = Record<Outcome, number>;

/** `idle` is the only phase of an untimed challenge, whose timer is null. */
export type Game = {
  players: Player[];
  difficulty: DifficultyOption;
  /** Index into players and tallies. */
  turn: number;
  /** One per player, in the same order. */
  tallies: Tally[];
  challengeId: string;
  timer: Timer | null;
  phase: Phase;
  played: number;
};

/** drawCard drops ids missing from its list, so each difficulty option has its own deck. */
export type Decks = Record<DifficultyOption, Deck>;

/** The decks live outside the game, so a new game keeps avoiding repeats. */
export type Session = {
  decks: Decks;
  game: Game | null;
};

export type Action =
  | { type: "start"; players: readonly Player[]; difficulty: DifficultyOption }
  | { type: "start-timer"; now: number }
  | { type: "pause"; now: number }
  | { type: "resume"; now: number }
  | { type: "expire"; now: number }
  | { type: "resolve"; outcome: Outcome }
  | { type: "end" };

export function createSession(): Session {
  return {
    decks: {
      easy: createDeck(),
      medium: createDeck(),
      hard: createDeck(),
      mixed: createDeck(),
    },
    game: null,
  };
}

function getOptionIds(difficulty: DifficultyOption): readonly string[] {
  return difficulty === "mixed" ? CHALLENGE_IDS : getChallengeIds(difficulty);
}

function deal(decks: Decks, difficulty: DifficultyOption) {
  const { deck, cardId } = drawCard(decks[difficulty], getOptionIds(difficulty));
  const seconds = getChallenge(cardId)?.timerSeconds;
  return {
    decks: { ...decks, [difficulty]: deck },
    dealt: {
      challengeId: cardId,
      timer: seconds === undefined ? null : createTimer(seconds),
      phase: "idle" as const,
    },
  };
}

/** A timed challenge is marked once its clock started; skipping is always allowed. */
function canResolve(game: Game, outcome: Outcome) {
  return outcome === "skipped" || game.timer === null || game.phase !== "idle";
}

function resolve(session: Session, game: Game, outcome: Outcome): Session {
  const { decks, dealt } = deal(session.decks, game.difficulty);
  return {
    decks,
    game: {
      ...game,
      ...dealt,
      played: game.played + 1,
      turn: getNextActiveIndex(game.turn, game.players.map(() => true)),
      tallies: game.tallies.map((tally, index) =>
        index === game.turn ? { ...tally, [outcome]: tally[outcome] + 1 } : tally,
      ),
    },
  };
}

export function reduceSession(session: Session, action: Action): Session {
  const { game } = session;

  if (action.type === "start") {
    const { decks, dealt } = deal(session.decks, action.difficulty);
    return {
      decks,
      game: {
        ...dealt,
        players: [...action.players],
        difficulty: action.difficulty,
        turn: 0,
        tallies: action.players.map(() => ({ completed: 0, failed: 0, skipped: 0 })),
        played: 1,
      },
    };
  }

  if (!game) return session;

  const { timer, phase } = game;

  switch (action.type) {
    case "start-timer":
      return timer && phase === "idle"
        ? {
            ...session,
            game: { ...game, phase: "running", timer: startTimer(timer, action.now) },
          }
        : session;
    case "pause":
      return timer && phase === "running"
        ? {
            ...session,
            game: { ...game, phase: "paused", timer: pauseTimer(timer, action.now) },
          }
        : session;
    case "resume":
      return timer && phase === "paused"
        ? {
            ...session,
            game: { ...game, phase: "running", timer: startTimer(timer, action.now) },
          }
        : session;
    case "expire":
      return timer && phase === "running" && getRemainingMs(timer, action.now) === 0
        ? {
            ...session,
            game: { ...game, phase: "expired", timer: pauseTimer(timer, action.now) },
          }
        : session;
    case "resolve":
      return canResolve(game, action.outcome) ? resolve(session, game, action.outcome) : session;
    case "end":
      return { ...session, game: null };
  }
}

export function getTotals(tallies: readonly Tally[]): Tally {
  return tallies.reduce(
    (totals, tally) => ({
      completed: totals.completed + tally.completed,
      failed: totals.failed + tally.failed,
      skipped: totals.skipped + tally.skipped,
    }),
    { completed: 0, failed: 0, skipped: 0 },
  );
}

function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isTally(value: unknown): value is Tally {
  if (typeof value !== "object" || value === null) return false;
  const tally = value as Partial<Tally>;
  return isCount(tally.completed) && isCount(tally.failed) && isCount(tally.skipped);
}

function isChallengeOfOption(game: Partial<Game>) {
  const { difficulty, challengeId } = game;
  return (
    DIFFICULTY_OPTIONS.some((option) => option === difficulty) &&
    typeof challengeId === "string" &&
    getOptionIds(difficulty as DifficultyOption).includes(challengeId)
  );
}

/** The timer must match the dealt challenge, and only a running phase has a deadline. */
function hasConsistentTimer(game: Partial<Game>) {
  const { challengeId, timer, phase } = game;
  const isTimed = getChallenge(challengeId ?? "")?.timerSeconds !== undefined;

  if (timer === null) return !isTimed && phase === "idle";
  if (!isTimed || !isTimer(timer)) return false;
  return (timer.deadlineMs !== null) === (phase === "running");
}

function isGame(value: unknown): value is Game {
  if (typeof value !== "object" || value === null) return false;
  const game = value as Partial<Game>;
  const { players, tallies, turn, played } = game;

  return (
    Array.isArray(players) &&
    players.length > 0 &&
    players.every(isPlayer) &&
    Array.isArray(tallies) &&
    tallies.length === players.length &&
    tallies.every(isTally) &&
    isCount(turn) &&
    turn < players.length &&
    isCount(played) &&
    played > 0 &&
    PHASES.some((phase) => phase === game.phase) &&
    isChallengeOfOption(game) &&
    hasConsistentTimer(game)
  );
}

function isDecks(value: unknown): value is Decks {
  if (typeof value !== "object" || value === null) return false;
  const decks = value as Partial<Decks>;
  return DIFFICULTY_OPTIONS.every((option) => isDeck(decks[option]));
}

export function isSession(value: unknown): value is Session {
  if (typeof value !== "object" || value === null) return false;
  const session = value as Partial<Session>;
  return isDecks(session.decks) && (session.game === null || isGame(session.game));
}

export const sessionStore = createPersistentStore<Session>({
  key: "calesita:desafio-relampago",
  version: 1,
  fallback: createSession(),
  validate: isSession,
});
