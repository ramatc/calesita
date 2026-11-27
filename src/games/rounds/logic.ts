import { createDeck, drawCard, isDeck, type Deck } from "@/games/deck";
import { createPersistentStore } from "@/lib/storage";
import {
  createTimer,
  getRemainingMs,
  isTimer,
  pauseTimer,
  startTimer,
  type Timer,
} from "@/lib/timer";

/**
 * Round-based games: each round deals a card, may run a clock, and ends when
 * the group says who scored. Players or teams compete the same way.
 */

const PHASES = ["ready", "running", "paused", "judging", "finished"] as const;

export type Phase = (typeof PHASES)[number];

export type Participant = {
  id: string;
  name: string;
  score: number;
  /** Seats behind this row: one player, or everyone on a team. */
  seatIds: string[];
};

export type Game = {
  participants: Participant[];
  totalRounds: number;
  /** 1-based. */
  round: number;
  cardId: string;
  /** Null for cards that play without a clock. */
  timer: Timer | null;
  phase: Phase;
};

/** The deck lives outside the game, so a new game keeps avoiding repeats. */
export type Session = {
  deck: Deck;
  game: Game | null;
};

export type Action =
  | { type: "start"; participants: readonly Omit<Participant, "score">[]; rounds: number }
  | { type: "start-timer"; now: number }
  | { type: "pause"; now: number }
  | { type: "resume"; now: number }
  | { type: "expire"; now: number }
  /** Ends the round; every id listed scores one point. An empty list means nobody scored. */
  | { type: "award"; winnerIds: readonly string[] }
  | { type: "end" };

export type RoundsContent = {
  cardIds: readonly string[];
  /** Undefined means the card plays without a clock. */
  getTimerSeconds: (cardId: string) => number | undefined;
};

export function createSession(): Session {
  return { deck: createDeck(), game: null };
}

/** Whose turn it is in games where participants take rounds one at a time. */
export function getTurnParticipant(game: Game): Participant {
  return game.participants[(game.round - 1) % game.participants.length];
}

export function getLeaders(game: Game): Participant[] {
  const top = Math.max(...game.participants.map((participant) => participant.score));
  return game.participants.filter((participant) => participant.score === top);
}

function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isParticipant(value: unknown): value is Participant {
  if (typeof value !== "object" || value === null) return false;
  const participant = value as Partial<Participant>;
  return (
    typeof participant.id === "string" &&
    typeof participant.name === "string" &&
    isCount(participant.score) &&
    Array.isArray(participant.seatIds) &&
    participant.seatIds.every((id) => typeof id === "string")
  );
}

export function createRoundsGame(content: RoundsContent, storageKey: string) {
  function deal(deck: Deck) {
    const { deck: nextDeck, cardId } = drawCard(deck, content.cardIds);
    const seconds = content.getTimerSeconds(cardId);
    return {
      deck: nextDeck,
      dealt: {
        cardId,
        timer: seconds === undefined ? null : createTimer(seconds),
        phase: (seconds === undefined ? "judging" : "ready") as Phase,
      },
    };
  }

  function award(session: Session, game: Game, winnerIds: readonly string[]): Session {
    const participants = game.participants.map((participant) =>
      winnerIds.includes(participant.id) ? { ...participant, score: participant.score + 1 } : participant,
    );
    if (game.round >= game.totalRounds) {
      return { ...session, game: { ...game, participants, phase: "finished" } };
    }
    const { deck, dealt } = deal(session.deck);
    return { deck, game: { ...game, ...dealt, participants, round: game.round + 1 } };
  }

  function reduceSession(session: Session, action: Action): Session {
    const { game } = session;

    if (action.type === "start") {
      if (action.participants.length === 0 || action.rounds < 1) return session;
      const { deck, dealt } = deal(session.deck);
      return {
        deck,
        game: {
          ...dealt,
          participants: action.participants.map((participant) => ({
            ...participant,
            seatIds: [...participant.seatIds],
            score: 0,
          })),
          totalRounds: action.rounds,
          round: 1,
        },
      };
    }

    if (!game) return session;
    const { timer, phase } = game;

    switch (action.type) {
      case "start-timer":
        return timer && phase === "ready"
          ? { ...session, game: { ...game, phase: "running", timer: startTimer(timer, action.now) } }
          : session;
      case "pause":
        return timer && phase === "running"
          ? { ...session, game: { ...game, phase: "paused", timer: pauseTimer(timer, action.now) } }
          : session;
      case "resume":
        return timer && phase === "paused"
          ? { ...session, game: { ...game, phase: "running", timer: startTimer(timer, action.now) } }
          : session;
      case "expire":
        return timer && phase === "running" && getRemainingMs(timer, action.now) === 0
          ? { ...session, game: { ...game, phase: "judging", timer: pauseTimer(timer, action.now) } }
          : session;
      case "award": {
        if (phase === "finished" || phase === "ready") return session;
        const known = action.winnerIds.filter((id) =>
          game.participants.some((participant) => participant.id === id),
        );
        return award(session, game, known);
      }
      case "end":
        return { ...session, game: null };
    }
  }

  /** A timed card has a timer, and only a running phase has a deadline. */
  function hasConsistentTimer(game: Partial<Game>) {
    const { cardId, timer, phase } = game;
    const isTimed = content.getTimerSeconds(cardId ?? "") !== undefined;
    if (timer === null) return !isTimed && (phase === "judging" || phase === "finished");
    if (!isTimed || !isTimer(timer)) return false;
    return (timer.deadlineMs !== null) === (phase === "running");
  }

  function isGame(value: unknown): value is Game {
    if (typeof value !== "object" || value === null) return false;
    const game = value as Partial<Game>;
    return (
      Array.isArray(game.participants) &&
      game.participants.length > 0 &&
      game.participants.every(isParticipant) &&
      isCount(game.totalRounds) &&
      isCount(game.round) &&
      game.round >= 1 &&
      game.round <= game.totalRounds &&
      typeof game.cardId === "string" &&
      content.cardIds.includes(game.cardId) &&
      PHASES.some((phase) => phase === game.phase) &&
      hasConsistentTimer(game)
    );
  }

  function isSession(value: unknown): value is Session {
    if (typeof value !== "object" || value === null) return false;
    const session = value as Partial<Session>;
    return isDeck(session.deck) && (session.game === null || isGame(session.game));
  }

  const sessionStore = createPersistentStore<Session>({
    key: storageKey,
    version: 1,
    fallback: createSession(),
    validate: isSession,
  });

  return { reduceSession, isSession, sessionStore };
}
