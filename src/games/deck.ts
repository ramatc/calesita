import { shuffle, type RandomSource } from "@/lib/random";

/** Ids still to deal. Storing this is what prevents repeats across a session. */
export type Deck = {
  remaining: string[];
  lastId: string | null;
  /** How many times the content was dealt; 0 means nothing was dealt yet. */
  cycle: number;
};

export function createDeck(): Deck {
  return { remaining: [], lastId: null, cycle: 0 };
}

function reshuffle(ids: readonly string[], lastId: string | null, random?: RandomSource) {
  const order = shuffle(ids, random);
  if (order.length > 1 && order[0] === lastId) {
    [order[0], order[1]] = [order[1], order[0]];
  }
  return order;
}

export function drawCard(
  deck: Deck,
  ids: readonly string[],
  random?: RandomSource,
): { deck: Deck; cardId: string } {
  const remaining = deck.remaining.filter((id) => ids.includes(id));
  const isNewCycle = remaining.length === 0;
  const [cardId, ...rest] = isNewCycle ? reshuffle(ids, deck.lastId, random) : remaining;

  return {
    cardId,
    deck: {
      remaining: rest,
      lastId: cardId,
      cycle: isNewCycle ? deck.cycle + 1 : deck.cycle,
    },
  };
}

export function getDeckProgress(deck: Deck, ids: readonly string[]) {
  return { dealt: ids.length - deck.remaining.length, total: ids.length };
}

export function isDeck(value: unknown): value is Deck {
  if (typeof value !== "object" || value === null) return false;
  const deck = value as Partial<Deck>;
  return (
    Array.isArray(deck.remaining) &&
    deck.remaining.every((id) => typeof id === "string") &&
    (deck.lastId === null || typeof deck.lastId === "string") &&
    typeof deck.cycle === "number"
  );
}
