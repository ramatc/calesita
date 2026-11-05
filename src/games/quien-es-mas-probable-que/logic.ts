import { QUESTION_IDS } from "@/content/quien-es-mas-probable-que";
import { createDeck, drawCard, isDeck, type Deck } from "@/games/deck";
import { createPersistentStore } from "@/lib/storage";

const PHASES = ["reading", "countdown", "pointing"] as const;

export type Phase = (typeof PHASES)[number];

export type Game = {
  players: number;
  phase: Phase;
  questionId: string;
  asked: number;
};

/** The deck lives outside the game, so a new game keeps avoiding repeats. */
export type Session = {
  deck: Deck;
  game: Game | null;
};

export type Action =
  | { type: "start"; players: number }
  | { type: "call-vote" }
  | { type: "reveal" }
  | { type: "next" }
  | { type: "end" };

export function createSession(): Session {
  return { deck: createDeck(), game: null };
}

function dealQuestion(deck: Deck) {
  const { deck: nextDeck, cardId } = drawCard(deck, QUESTION_IDS);
  return { deck: nextDeck, questionId: cardId };
}

export function reduceSession(session: Session, action: Action): Session {
  const { game } = session;

  if (action.type === "start") {
    const { deck, questionId } = dealQuestion(session.deck);
    return {
      deck,
      game: { players: action.players, phase: "reading", questionId, asked: 1 },
    };
  }

  if (!game) return session;

  switch (action.type) {
    case "call-vote":
      return game.phase === "reading"
        ? { ...session, game: { ...game, phase: "countdown" } }
        : session;
    case "reveal":
      return game.phase === "countdown"
        ? { ...session, game: { ...game, phase: "pointing" } }
        : session;
    case "next": {
      if (game.phase === "countdown") return session;
      const { deck, questionId } = dealQuestion(session.deck);
      return {
        deck,
        game: { ...game, phase: "reading", questionId, asked: game.asked + 1 },
      };
    }
    case "end":
      return { ...session, game: null };
  }
}

function isGame(value: unknown): value is Game {
  if (typeof value !== "object" || value === null) return false;
  const game = value as Partial<Game>;
  return (
    typeof game.players === "number" &&
    typeof game.asked === "number" &&
    PHASES.some((phase) => phase === game.phase) &&
    QUESTION_IDS.some((id) => id === game.questionId)
  );
}

export function isSession(value: unknown): value is Session {
  if (typeof value !== "object" || value === null) return false;
  const session = value as Partial<Session>;
  return isDeck(session.deck) && (session.game === null || isGame(session.game));
}

export const sessionStore = createPersistentStore<Session>({
  key: "calesita:quien-es-mas-probable-que",
  version: 1,
  fallback: createSession(),
  validate: isSession,
});
