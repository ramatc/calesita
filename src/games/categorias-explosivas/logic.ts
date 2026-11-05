import { CATEGORY_IDS } from "@/content/categorias-explosivas";
import { createDeck, drawCard, isDeck, type Deck } from "@/games/deck";
import { getNextActiveIndex, isPlayer, type Player } from "@/games/players";
import { createPersistentStore } from "@/lib/storage";
import { createTimer, isTimer, pauseTimer, startTimer, type Timer } from "@/lib/timer";

export const SECONDS_OPTIONS = [5, 10, 15] as const;
export const LIVES_OPTIONS = [1, 2, 3] as const;
export const DEFAULT_SECONDS: SecondsOption = 10;
export const DEFAULT_LIVES: LivesOption = 3;

const PHASES = ["ready", "turn", "life-lost", "finished"] as const;
const LOSS_REASONS = ["mistake", "timeout"] as const;
const MIN_PLAYERS = 2;

export type SecondsOption = (typeof SECONDS_OPTIONS)[number];
export type LivesOption = (typeof LIVES_OPTIONS)[number];
export type Phase = (typeof PHASES)[number];
export type LossReason = (typeof LOSS_REASONS)[number];
export type Contestant = Player & { lives: number };

export type Game = {
  players: Contestant[];
  /** During life-lost and finished, this is the player who just lost a life. */
  currentIndex: number;
  phase: Phase;
  categoryId: string;
  categoriesPlayed: number;
  seconds: SecondsOption;
  maxLives: LivesOption;
  timer: Timer;
  lastLoss: LossReason | null;
};

/** The deck lives outside the game, so a new game keeps avoiding repeats. */
export type Session = {
  deck: Deck;
  game: Game | null;
};

type TurnAction = {
  type: "pause" | "resume" | "right" | "wrong" | "timeout";
  now: number;
};

export type Action =
  | { type: "start"; players: readonly Player[]; seconds: SecondsOption; lives: LivesOption }
  | { type: "begin-turn"; now: number }
  | TurnAction
  | { type: "continue" }
  | { type: "end" };

export function createSession(): Session {
  return { deck: createDeck(), game: null };
}

function dealCategory(deck: Deck) {
  const { deck: nextDeck, cardId } = drawCard(deck, CATEGORY_IDS);
  return { deck: nextDeck, categoryId: cardId };
}

function getNextIndex(game: Game) {
  const active = game.players.map((player) => player.lives > 0);
  return getNextActiveIndex(game.currentIndex, active);
}

/** Who plays after the current player, skipping anyone without lives. */
export function getNextPlayer(game: Game): Contestant | undefined {
  return game.players[getNextIndex(game)];
}

/** The last player with lives, once there is only one. */
export function getWinner(game: Game): Contestant | undefined {
  const remaining = game.players.filter((player) => player.lives > 0);
  return remaining.length === 1 ? remaining[0] : undefined;
}

function loseLife(game: Game, reason: LossReason): Game {
  const players = game.players.map((player, index) =>
    index === game.currentIndex ? { ...player, lives: player.lives - 1 } : player,
  );
  const isOver = players.filter((player) => player.lives > 0).length === 1;

  return {
    ...game,
    players,
    phase: isOver ? "finished" : "life-lost",
    lastLoss: reason,
    timer: createTimer(game.seconds),
  };
}

function reduceTurn(game: Game, { type, now }: TurnAction): Game {
  const { timer } = game;
  const { deadlineMs } = timer;
  const isPaused = deadlineMs === null;

  // A late result still resolves as the timeout it already is, so the loser pays once.
  if (deadlineMs !== null && now >= deadlineMs) return loseLife(game, "timeout");

  switch (type) {
    case "pause":
      return isPaused ? game : { ...game, timer: pauseTimer(timer, now) };
    case "resume":
      return isPaused ? { ...game, timer: startTimer(timer, now) } : game;
    case "right":
      return isPaused
        ? game
        : {
            ...game,
            currentIndex: getNextIndex(game),
            timer: startTimer(createTimer(game.seconds), now),
          };
    case "wrong":
      return isPaused ? game : loseLife(game, "mistake");
    case "timeout":
      return game;
  }
}

export function reduceSession(session: Session, action: Action): Session {
  const { game } = session;

  if (action.type === "start") {
    if (game) return session;
    const { deck, categoryId } = dealCategory(session.deck);
    return {
      deck,
      game: {
        players: action.players.map(({ id, name }) => ({ id, name, lives: action.lives })),
        currentIndex: 0,
        phase: "ready",
        categoryId,
        categoriesPlayed: 1,
        seconds: action.seconds,
        maxLives: action.lives,
        timer: createTimer(action.seconds),
        lastLoss: null,
      },
    };
  }

  if (!game) return session;

  switch (action.type) {
    case "begin-turn":
      return game.phase === "ready"
        ? {
            ...session,
            game: { ...game, phase: "turn", timer: startTimer(game.timer, action.now) },
          }
        : session;
    case "continue": {
      if (game.phase !== "life-lost") return session;
      const { deck, categoryId } = dealCategory(session.deck);
      return {
        deck,
        game: {
          ...game,
          phase: "ready",
          currentIndex: getNextIndex(game),
          categoryId,
          categoriesPlayed: game.categoriesPlayed + 1,
          lastLoss: null,
        },
      };
    }
    case "end":
      return { ...session, game: null };
    default: {
      if (game.phase !== "turn") return session;
      const next = reduceTurn(game, action);
      return next === game ? session : { ...session, game: next };
    }
  }
}

function isContestant(value: unknown, maxLives: number): value is Contestant {
  if (!isPlayer(value)) return false;
  const { lives } = value as Partial<Contestant>;
  return Number.isInteger(lives) && (lives as number) >= 0 && (lives as number) <= maxLives;
}

/** Phases carry different guarantees; a stored game that breaks them could never finish. */
function hasConsistentPhase(game: Game) {
  const remaining = game.players.filter((player) => player.lives > 0).length;
  const isPlaying = game.phase === "ready" || game.phase === "turn";

  if (game.phase === "finished" ? remaining !== 1 : remaining < 2) return false;
  if (isPlaying && game.players[game.currentIndex].lives === 0) return false;
  if (isPlaying !== (game.lastLoss === null)) return false;
  return game.phase === "turn" || game.timer.deadlineMs === null;
}

function isGame(value: unknown): value is Game {
  if (typeof value !== "object" || value === null) return false;
  const game = value as Partial<Game>;
  const { players, seconds, maxLives, timer } = game;
  return (
    SECONDS_OPTIONS.some((option) => option === seconds) &&
    LIVES_OPTIONS.some((option) => option === maxLives) &&
    Array.isArray(players) &&
    players.length >= MIN_PLAYERS &&
    players.every((player) => isContestant(player, maxLives as number)) &&
    Number.isInteger(game.currentIndex) &&
    (game.currentIndex as number) >= 0 &&
    (game.currentIndex as number) < players.length &&
    Number.isInteger(game.categoriesPlayed) &&
    PHASES.some((phase) => phase === game.phase) &&
    CATEGORY_IDS.some((id) => id === game.categoryId) &&
    (game.lastLoss === null || LOSS_REASONS.some((reason) => reason === game.lastLoss)) &&
    isTimer(timer) &&
    timer.durationMs === (seconds as number) * 1000 &&
    hasConsistentPhase(game as Game)
  );
}

export function isSession(value: unknown): value is Session {
  if (typeof value !== "object" || value === null) return false;
  const session = value as Partial<Session>;
  return isDeck(session.deck) && (session.game === null || isGame(session.game));
}

export const sessionStore = createPersistentStore<Session>({
  key: "calesita:categorias-explosivas",
  version: 1,
  fallback: createSession(),
  validate: isSession,
});
