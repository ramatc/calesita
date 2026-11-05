import { describe, expect, it } from "vitest";

import { createDeck, drawCard, getDeckProgress, isDeck } from "@/games/deck";

const ids = ["a", "b", "c", "d"];

function drawMany(count: number, cardIds = ids) {
  let deck = createDeck();
  const drawn: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const result = drawCard(deck, cardIds);
    deck = result.deck;
    drawn.push(result.cardId);
  }
  return { deck, drawn };
}

describe("drawCard", () => {
  it("repeats no card until the content is exhausted", () => {
    expect([...drawMany(4).drawn].sort()).toEqual(ids);
  });

  it("deals every card again in the next cycle", () => {
    const { drawn } = drawMany(8);
    expect([...drawn.slice(4)].sort()).toEqual(ids);
  });

  it("never repeats a card across the cycle boundary", () => {
    for (let run = 0; run < 200; run += 1) {
      const { drawn } = drawMany(5);
      expect(drawn[4]).not.toBe(drawn[3]);
    }
  });

  it("skips ids that left the content", () => {
    const deck = { remaining: ["gone", "b"], lastId: null, cycle: 1 };
    expect(drawCard(deck, ids).cardId).toBe("b");
  });

  it("works with a single card", () => {
    expect(drawMany(3, ["only"]).drawn).toEqual(["only", "only", "only"]);
  });
});

describe("getDeckProgress", () => {
  it("counts the cards dealt in the current cycle", () => {
    expect(getDeckProgress(drawMany(1).deck, ids)).toEqual({ dealt: 1, total: 4 });
    expect(getDeckProgress(drawMany(4).deck, ids)).toEqual({ dealt: 4, total: 4 });
    expect(getDeckProgress(drawMany(5).deck, ids)).toEqual({ dealt: 1, total: 4 });
  });
});

describe("isDeck", () => {
  it("accepts a valid deck and rejects malformed ones", () => {
    expect(isDeck(drawMany(2).deck)).toBe(true);
    expect(isDeck({ remaining: "a", lastId: null, cycle: 1 })).toBe(false);
    expect(isDeck({ remaining: [1], lastId: null, cycle: 1 })).toBe(false);
    expect(isDeck(null)).toBe(false);
  });
});
