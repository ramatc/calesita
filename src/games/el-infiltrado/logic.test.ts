import { describe, expect, it } from "vitest";

import { getWordPair, PAIR_IDS, RULES, WORD_PAIRS } from "@/content/el-infiltrado";
import {
  createSession,
  didGroupWin,
  getFirstCluePlayer,
  getInfiltrator,
  getRevealPlayer,
  getWordFor,
  isLastReveal,
  isSession,
  MAX_PLAYERS,
  MIN_PLAYERS,
  reduceSession,
  type Action,
  type Session,
} from "@/games/el-infiltrado/logic";
import { createPlayers } from "@/games/players";
import type { RandomSource } from "@/lib/random";

/** Returns the given values in order, then repeats the last one. */
function sequence(...values: number[]): RandomSource {
  let index = 0;
  return () => values[Math.min(index++, values.length - 1)];
}

function started(count = 4, random: RandomSource = sequence(0)) {
  return reduceSession(createSession(), {
    type: "start",
    players: createPlayers(count),
    random,
  });
}

function game(session: Session) {
  if (!session.game) throw new Error("expected an active game");
  return session.game;
}

function run(session: Session, ...actions: Action[]) {
  return actions.reduce(reduceSession, session);
}

/** Every player reveals, hides and passes, which opens the clue round. */
function allRevealed(session: Session) {
  let next = session;
  for (let index = 0; index < game(session).players.length; index += 1) {
    next = run(next, { type: "reveal" }, { type: "hide" }, { type: "pass" });
  }
  return next;
}

function inVote(count = 4, random?: RandomSource) {
  return reduceSession(allRevealed(started(count, random)), { type: "start-vote" });
}

describe("word pair content", () => {
  it("has at least 40 pairs with unique ids and two different words each", () => {
    expect(WORD_PAIRS.length).toBeGreaterThanOrEqual(40);
    expect(new Set(PAIR_IDS).size).toBe(WORD_PAIRS.length);
    for (const pair of WORD_PAIRS) {
      expect(pair.packId).toBe("base");
      expect(pair.words[0].trim()).not.toBe("");
      expect(pair.words[1].trim()).not.toBe("");
      expect(pair.words[0].toLowerCase()).not.toBe(pair.words[1].toLowerCase());
    }
  });

  it("never repeats a word pair", () => {
    const keys = WORD_PAIRS.map((pair) => [...pair.words].sort().join("|").toLowerCase());
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("finds a pair by id and has rules", () => {
    expect(getWordPair(PAIR_IDS[0])).toBe(WORD_PAIRS[0]);
    expect(getWordPair("missing")).toBeUndefined();
    expect(RULES.length).toBeGreaterThan(0);
  });
});

describe("starting a game", () => {
  it("accepts 4 to 12 players and ignores other counts", () => {
    expect(MIN_PLAYERS).toBe(4);
    expect(MAX_PLAYERS).toBe(12);
    expect(started(3).game).toBeNull();
    expect(started(13).game).toBeNull();
    expect(game(started(4)).players).toHaveLength(4);
    expect(game(started(12)).players).toHaveLength(12);
  });

  it("keeps the optional names", () => {
    const session = reduceSession(createSession(), {
      type: "start",
      players: createPlayers(4, ["Ana", "", "Lu"]),
    });
    expect(game(session).players.map((player) => player.name)).toEqual([
      "Ana",
      "Jugador 2",
      "Lu",
      "Jugador 4",
    ]);
  });

  it("gives one word to the majority and the other one to a single infiltrator", () => {
    const current = game(started(6, sequence(0.9, 0.5, 0)));
    const pair = getWordPair(current.pairId);
    if (!pair) throw new Error("expected a pair");

    const words = current.players.map((player) => getWordFor(current, player.id));
    const infiltrator = getInfiltrator(current);
    expect(infiltrator.id).toBe("player-4");
    expect(getWordFor(current, infiltrator.id)).toBe(pair.words[0]);
    expect(words.filter((word) => word === pair.words[1])).toHaveLength(5);
    expect(words.filter((word) => word === pair.words[0])).toHaveLength(1);
  });

  it("chooses who opens the clue round", () => {
    expect(getFirstCluePlayer(game(started(4, sequence(0, 0, 0.75)))).id).toBe("player-4");
  });

  it("starts with the first player holding a hidden word", () => {
    const current = game(started());
    expect(current.phase).toBe("reveal");
    expect(current.revealStep).toBe("waiting");
    expect(getRevealPlayer(current).id).toBe("player-1");
    expect(current.votedId).toBeNull();
  });

  it("does not restart a game in progress", () => {
    const session = started();
    expect(reduceSession(session, { type: "start", players: createPlayers(5) })).toBe(session);
  });

  it("does not repeat a pair in later games until every pair was used", () => {
    let session = createSession();
    const seen = new Set<string>();
    for (let index = 0; index < PAIR_IDS.length; index += 1) {
      session = run(session, { type: "end" }, { type: "start", players: createPlayers(4) });
      seen.add(game(session).pairId);
    }
    expect(seen.size).toBe(PAIR_IDS.length);
  });
});

describe("revealing words", () => {
  it("follows Revelar, Ocultar and Pasar al siguiente in that order", () => {
    const session = started();
    expect(reduceSession(session, { type: "hide" })).toBe(session);
    expect(reduceSession(session, { type: "pass" })).toBe(session);

    const revealed = reduceSession(session, { type: "reveal" });
    expect(game(revealed).revealStep).toBe("revealed");
    expect(reduceSession(revealed, { type: "pass" })).toBe(revealed);

    const hidden = reduceSession(revealed, { type: "hide" });
    expect(game(hidden).revealStep).toBe("hidden");

    const passed = reduceSession(hidden, { type: "pass" });
    expect(game(passed).revealStep).toBe("waiting");
    expect(getRevealPlayer(game(passed)).id).toBe("player-2");
  });

  it("does not show a word again once it was hidden", () => {
    const hidden = run(started(), { type: "reveal" }, { type: "hide" });
    expect(reduceSession(hidden, { type: "reveal" })).toBe(hidden);
  });

  it("opens the clue round after the last player hides and passes", () => {
    const beforeLast = run(
      started(4),
      ...Array.from({ length: 3 }, () => [
        { type: "reveal" } as const,
        { type: "hide" } as const,
        { type: "pass" } as const,
      ]).flat(),
    );
    expect(isLastReveal(game(beforeLast))).toBe(true);
    expect(game(beforeLast).phase).toBe("reveal");

    const clues = run(beforeLast, { type: "reveal" }, { type: "hide" }, { type: "pass" });
    expect(game(clues).phase).toBe("clues");
  });
});

describe("voting and result", () => {
  it("moves from clues to the vote only after every word was revealed", () => {
    expect(reduceSession(started(), { type: "start-vote" })).toEqual(started());
    expect(game(inVote()).phase).toBe("vote");
  });

  it("records and changes the chosen player, ignoring unknown ids", () => {
    const session = inVote();
    expect(reduceSession(session, { type: "vote", playerId: "nobody" })).toBe(session);
    const first = reduceSession(session, { type: "vote", playerId: "player-2" });
    expect(game(first).votedId).toBe("player-2");
    const changed = reduceSession(first, { type: "vote", playerId: "player-3" });
    expect(game(changed).votedId).toBe("player-3");
  });

  it("only reveals the infiltrator once someone was chosen", () => {
    const session = inVote();
    expect(reduceSession(session, { type: "reveal-infiltrator" })).toBe(session);
    const voted = reduceSession(session, { type: "vote", playerId: "player-1" });
    expect(game(reduceSession(voted, { type: "reveal-infiltrator" })).phase).toBe("result");
  });

  it("lets the group win when it chose the infiltrator", () => {
    const session = inVote(4, sequence(0, 0.5, 0));
    const infiltratorId = getInfiltrator(game(session)).id;
    const result = run(
      session,
      { type: "vote", playerId: infiltratorId },
      { type: "reveal-infiltrator" },
    );
    expect(didGroupWin(game(result))).toBe(true);
  });

  it("lets the infiltrator win when the group chose someone else", () => {
    const session = inVote(4, sequence(0, 0.5, 0));
    const result = run(
      session,
      { type: "vote", playerId: "player-1" },
      { type: "reveal-infiltrator" },
    );
    expect(getInfiltrator(game(result)).id).toBe("player-3");
    expect(didGroupWin(game(result))).toBe(false);
  });

  it("does not take votes after the result", () => {
    const result = run(
      inVote(),
      { type: "vote", playerId: "player-1" },
      { type: "reveal-infiltrator" },
    );
    expect(reduceSession(result, { type: "vote", playerId: "player-2" })).toBe(result);
  });

  it("plays again with the same players and a new pair", () => {
    const result = run(
      inVote(5),
      { type: "vote", playerId: "player-1" },
      { type: "reveal-infiltrator" },
    );
    const again = reduceSession(result, { type: "play-again" });
    expect(game(again).phase).toBe("reveal");
    expect(game(again).players).toEqual(game(result).players);
    expect(game(again).pairId).not.toBe(game(result).pairId);
    expect(game(again).votedId).toBeNull();
    expect(reduceSession(started(), { type: "play-again" })).toEqual(started());
  });

  it("ends the game but keeps the deck", () => {
    const session = started();
    const ended = reduceSession(session, { type: "end" });
    expect(ended.game).toBeNull();
    expect(ended.deck).toEqual(session.deck);
  });
});

describe("stored sessions", () => {
  it("accepts every phase a game goes through", () => {
    const voted = reduceSession(inVote(), { type: "vote", playerId: "player-1" });
    for (const session of [
      createSession(),
      started(),
      reduceSession(started(), { type: "reveal" }),
      allRevealed(started()),
      voted,
      reduceSession(voted, { type: "reveal-infiltrator" }),
    ]) {
      expect(isSession(JSON.parse(JSON.stringify(session)))).toBe(true);
    }
  });

  it("rejects games that could leak or break the round", () => {
    const current = game(started());
    const broken = [
      { ...current, pairId: "missing" },
      { ...current, infiltratorId: "nobody" },
      { ...current, revealIndex: 4 },
      { ...current, revealStep: "peeking" },
      { ...current, phase: "result", votedId: null },
      { ...current, votedId: "nobody" },
      { ...current, players: createPlayers(3) },
    ];
    for (const value of broken) {
      expect(isSession({ deck: started().deck, game: value })).toBe(false);
    }
  });
});
