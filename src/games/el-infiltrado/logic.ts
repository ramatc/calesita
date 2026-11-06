import { getWordPair, PAIR_IDS } from "@/content/el-infiltrado";
import { createDeck, drawCard, isDeck, type Deck } from "@/games/deck";
import { isPlayer, type Player } from "@/games/players";
import type { RandomSource } from "@/lib/random";
import { createPersistentStore } from "@/lib/storage";

export const SLUG = "el-infiltrado";
export const MIN_PLAYERS = 4;
export const MAX_PLAYERS = 12;

const PHASES = ["reveal", "clues", "vote", "result"] as const;
const REVEAL_STEPS = ["waiting", "revealed", "hidden"] as const;

export type Phase = (typeof PHASES)[number];
/** waiting: word covered; revealed: on screen; hidden: seen and covered for good. */
export type RevealStep = (typeof REVEAL_STEPS)[number];

export type Game = {
  players: Player[];
  pairId: string;
  /** Index in the pair's words of the majority word; the infiltrator gets the other one. */
  majorityWord: 0 | 1;
  infiltratorId: string;
  phase: Phase;
  /** Who holds the device while words are revealed. */
  revealIndex: number;
  revealStep: RevealStep;
  /** Who gives the first clue. */
  firstClueIndex: number;
  votedId: string | null;
};

/** The deck lives outside the game, so a new game keeps avoiding repeats. */
export type Session = {
  deck: Deck;
  game: Game | null;
};

export type Action =
  | { type: "start"; players: readonly Player[]; random?: RandomSource }
  | { type: "reveal" }
  | { type: "hide" }
  | { type: "pass" }
  | { type: "start-vote" }
  | { type: "vote"; playerId: string }
  | { type: "reveal-infiltrator" }
  | { type: "play-again"; random?: RandomSource }
  | { type: "end" };

export function createSession(): Session {
  return { deck: createDeck(), game: null };
}

function pickIndex(count: number, random: RandomSource) {
  return Math.min(Math.floor(random() * count), count - 1);
}

function createGame(
  deck: Deck,
  players: readonly Player[],
  random: RandomSource = Math.random,
): Session {
  const majorityWord = random() < 0.5 ? 0 : 1;
  const infiltratorIndex = pickIndex(players.length, random);
  const firstClueIndex = pickIndex(players.length, random);
  const { deck: nextDeck, cardId } = drawCard(deck, PAIR_IDS, random);

  return {
    deck: nextDeck,
    game: {
      players: [...players],
      pairId: cardId,
      majorityWord,
      infiltratorId: players[infiltratorIndex].id,
      phase: "reveal",
      revealIndex: 0,
      revealStep: "waiting",
      firstClueIndex,
      votedId: null,
    },
  };
}

export function getRevealPlayer(game: Game): Player {
  return game.players[game.revealIndex];
}

export function isLastReveal(game: Game): boolean {
  return game.revealIndex === game.players.length - 1;
}

export function getFirstCluePlayer(game: Game): Player {
  return game.players[game.firstClueIndex];
}

export function getInfiltrator(game: Game): Player {
  return game.players.find((player) => player.id === game.infiltratorId) ?? game.players[0];
}

/** The secret word of a player. Only call it where that player alone can see the screen. */
export function getWordFor(game: Game, playerId: string): string {
  const words = getWordPair(game.pairId)?.words ?? ["", ""];
  const index = playerId === game.infiltratorId ? 1 - game.majorityWord : game.majorityWord;
  return words[index];
}

export function getPairWords(game: Game) {
  const words = getWordPair(game.pairId)?.words ?? ["", ""];
  return { majority: words[game.majorityWord], infiltrator: words[1 - game.majorityWord] };
}

export function didGroupWin(game: Game): boolean {
  return game.votedId === game.infiltratorId;
}

function withGame(session: Session, game: Game): Session {
  return { ...session, game };
}

function reduceReveal(session: Session, game: Game, action: Action): Session {
  switch (action.type) {
    case "reveal":
      return game.revealStep === "waiting"
        ? withGame(session, { ...game, revealStep: "revealed" })
        : session;
    case "hide":
      return game.revealStep === "revealed"
        ? withGame(session, { ...game, revealStep: "hidden" })
        : session;
    case "pass":
      if (game.revealStep !== "hidden") return session;
      if (isLastReveal(game)) return withGame(session, { ...game, phase: "clues" });
      return withGame(session, {
        ...game,
        revealIndex: game.revealIndex + 1,
        revealStep: "waiting",
      });
    default:
      return session;
  }
}

export function reduceSession(session: Session, action: Action): Session {
  const { game } = session;

  if (action.type === "start") {
    if (game && game.phase !== "result") return session;
    const count = action.players.length;
    if (count < MIN_PLAYERS || count > MAX_PLAYERS) return session;
    return createGame(session.deck, action.players, action.random);
  }

  if (!game) return session;
  if (action.type === "end") return { ...session, game: null };

  switch (game.phase) {
    case "reveal":
      return reduceReveal(session, game, action);
    case "clues":
      return action.type === "start-vote" ? withGame(session, { ...game, phase: "vote" }) : session;
    case "vote":
      if (action.type === "vote") {
        if (!game.players.some((player) => player.id === action.playerId)) return session;
        return withGame(session, { ...game, votedId: action.playerId });
      }
      if (action.type === "reveal-infiltrator" && game.votedId !== null) {
        return withGame(session, { ...game, phase: "result" });
      }
      return session;
    case "result":
      return action.type === "play-again"
        ? createGame(session.deck, game.players, action.random)
        : session;
  }
}

function isIndex(value: unknown, length: number): value is number {
  return Number.isInteger(value) && (value as number) >= 0 && (value as number) < length;
}

function isGame(value: unknown): value is Game {
  if (typeof value !== "object" || value === null) return false;
  const game = value as Partial<Game>;
  if (!Array.isArray(game.players) || !game.players.every(isPlayer)) return false;

  const ids = game.players.map((player) => player.id);
  const count = ids.length;
  const isMember = (id: unknown) => typeof id === "string" && ids.includes(id);

  return (
    count >= MIN_PLAYERS &&
    count <= MAX_PLAYERS &&
    new Set(ids).size === count &&
    typeof game.pairId === "string" &&
    PAIR_IDS.includes(game.pairId) &&
    (game.majorityWord === 0 || game.majorityWord === 1) &&
    isMember(game.infiltratorId) &&
    PHASES.some((phase) => phase === game.phase) &&
    isIndex(game.revealIndex, count) &&
    REVEAL_STEPS.some((step) => step === game.revealStep) &&
    isIndex(game.firstClueIndex, count) &&
    (game.phase === "result" ? isMember(game.votedId) : game.votedId === null || isMember(game.votedId))
  );
}

export function isSession(value: unknown): value is Session {
  if (typeof value !== "object" || value === null) return false;
  const session = value as Partial<Session>;
  return isDeck(session.deck) && (session.game === null || isGame(session.game));
}

export const sessionStore = createPersistentStore<Session>({
  key: "calesita:el-infiltrado",
  version: 1,
  fallback: createSession(),
  validate: isSession,
});
