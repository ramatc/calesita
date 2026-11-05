import { describe, expect, it } from "vitest";

import {
  CATEGORIES,
  CATEGORY_IDS,
  getCategoryText,
  RULES,
} from "@/content/categorias-explosivas";
import {
  createSession,
  DEFAULT_LIVES,
  DEFAULT_SECONDS,
  getNextPlayer,
  getWinner,
  isSession,
  LIVES_OPTIONS,
  reduceSession,
  SECONDS_OPTIONS,
  type LivesOption,
  type SecondsOption,
  type Session,
} from "@/games/categorias-explosivas/logic";
import { createPlayers } from "@/games/players";

const NOW = 1_000_000;
const SECONDS: SecondsOption = 10;
const TURN_MS = SECONDS * 1000;

function started(count = 3, lives: LivesOption = 3, seconds: SecondsOption = SECONDS) {
  return reduceSession(createSession(), {
    type: "start",
    players: createPlayers(count),
    seconds,
    lives,
  });
}

function inTurn(count = 3, lives: LivesOption = 3) {
  return reduceSession(started(count, lives), { type: "begin-turn", now: NOW });
}

function game(session: Session) {
  if (!session.game) throw new Error("expected an active game");
  return session.game;
}

function lives(session: Session) {
  return game(session).players.map((player) => player.lives);
}

/** Current player makes a mistake and the group moves on to the next category. */
function loseAndContinue(session: Session, now = NOW) {
  const lost = reduceSession(session, { type: "wrong", now });
  const ready = reduceSession(lost, { type: "continue" });
  return reduceSession(ready, { type: "begin-turn", now });
}

describe("category content", () => {
  it("has at least 60 categories with unique ids and texts in the base pack", () => {
    expect(CATEGORIES.length).toBeGreaterThanOrEqual(60);
    expect(new Set(CATEGORIES.map((category) => category.id)).size).toBe(CATEGORIES.length);
    expect(new Set(CATEGORIES.map((category) => category.text)).size).toBe(CATEGORIES.length);
    for (const category of CATEGORIES) {
      expect(category.id).toMatch(/^cat-\d{3}$/);
      expect(category.packId).toBe("base");
    }
  });

  it("includes the six example categories from the brief", () => {
    expect(CATEGORIES.map((category) => category.text)).toEqual(
      expect.arrayContaining([
        "Cosas que hay en una cocina",
        "Excusas para llegar tarde",
        "Países",
        "Marcas de autos",
        "Cosas que no deberías decir en una entrevista de trabajo",
        "Objetos que llevarías a una isla desierta",
      ]),
    );
  });

  it("exposes the ids and a lookup", () => {
    expect(CATEGORY_IDS).toHaveLength(CATEGORIES.length);
    expect(getCategoryText(CATEGORIES[0].id)).toBe(CATEGORIES[0].text);
    expect(getCategoryText("gone")).toBeUndefined();
  });

  it("has 4 or 5 rules that explain the new category after a lost life", () => {
    expect(RULES.length).toBeGreaterThanOrEqual(4);
    expect(RULES.length).toBeLessThanOrEqual(5);
    expect(RULES.some((rule) => /categoría nueva/.test(rule))).toBe(true);
  });
});

describe("setup", () => {
  it("offers 5, 10 or 15 seconds and 1, 2 or 3 lives, defaulting to 10 and 3", () => {
    expect(SECONDS_OPTIONS).toEqual([5, 10, 15]);
    expect(DEFAULT_SECONDS).toBe(10);
    expect(LIVES_OPTIONS).toEqual([1, 2, 3]);
    expect(DEFAULT_LIVES).toBe(3);
  });

  it("starts ready with the first player, a category and everyone at full lives", () => {
    const current = game(started(4, 2, 15));
    expect(current).toMatchObject({ phase: "ready", currentIndex: 0, seconds: 15, maxLives: 2 });
    expect(current.players.map((player) => player.lives)).toEqual([2, 2, 2, 2]);
    expect(current.players[1].name).toBe("Jugador 2");
    expect(CATEGORY_IDS).toContain(current.categoryId);
    expect(current.timer).toMatchObject({ durationMs: 15_000, deadlineMs: null });
  });

  it("does not replace a game that is still running", () => {
    const session = started();
    const action = { type: "start", players: createPlayers(2), seconds: 5, lives: 1 } as const;
    expect(reduceSession(session, action)).toBe(session);
  });
});

describe("turn", () => {
  it("starts the timer when the turn begins", () => {
    const current = game(inTurn());
    expect(current.phase).toBe("turn");
    expect(current.timer.deadlineMs).toBe(NOW + TURN_MS);
  });

  it("passes a right answer to the next player, with a fresh timer and the same category", () => {
    const session = inTurn();
    const next = reduceSession(session, { type: "right", now: NOW + 4_000 });

    expect(game(next)).toMatchObject({ phase: "turn", currentIndex: 1 });
    expect(game(next).categoryId).toBe(game(session).categoryId);
    expect(game(next).timer.deadlineMs).toBe(NOW + 4_000 + TURN_MS);
    expect(game(next).timer.remainingMs).toBe(TURN_MS);
    expect(lives(next)).toEqual([3, 3, 3]);
    expect(next.deck).toBe(session.deck);
  });

  it("wraps the turn around after the last player", () => {
    let session = inTurn(2);
    session = reduceSession(session, { type: "right", now: NOW });
    expect(game(session).currentIndex).toBe(1);
    session = reduceSession(session, { type: "right", now: NOW });
    expect(game(session).currentIndex).toBe(0);
  });

  it("costs one life on a mistake and stops the timer", () => {
    const next = reduceSession(inTurn(), { type: "wrong", now: NOW + 1_000 });

    expect(game(next)).toMatchObject({ phase: "life-lost", currentIndex: 0, lastLoss: "mistake" });
    expect(lives(next)).toEqual([2, 3, 3]);
    expect(game(next).timer.deadlineMs).toBeNull();
  });

  it("costs one life when the timer runs out", () => {
    const next = reduceSession(inTurn(), { type: "timeout", now: NOW + TURN_MS });

    expect(game(next)).toMatchObject({ phase: "life-lost", currentIndex: 0, lastLoss: "timeout" });
    expect(lives(next)).toEqual([2, 3, 3]);
  });

  it("ignores a timeout from before the deadline, such as a stale timer", () => {
    const session = reduceSession(inTurn(), { type: "right", now: NOW + 9_000 });
    expect(reduceSession(session, { type: "timeout", now: NOW + TURN_MS })).toBe(session);
  });

  it("costs a single life when a timeout and a mistake collide", () => {
    const afterTimeout = reduceSession(inTurn(), { type: "timeout", now: NOW + TURN_MS });
    const afterBoth = reduceSession(afterTimeout, { type: "wrong", now: NOW + TURN_MS });
    expect(afterBoth).toBe(afterTimeout);

    const afterMistake = reduceSession(inTurn(), { type: "wrong", now: NOW + TURN_MS - 1 });
    expect(reduceSession(afterMistake, { type: "timeout", now: NOW + TURN_MS })).toBe(afterMistake);
    expect(lives(afterMistake)).toEqual([2, 3, 3]);
  });

  it("counts a result recorded after the deadline as a timeout", () => {
    for (const type of ["right", "wrong", "pause"] as const) {
      const next = reduceSession(inTurn(), { type, now: NOW + TURN_MS + 1 });
      expect(game(next)).toMatchObject({ phase: "life-lost", currentIndex: 0, lastLoss: "timeout" });
      expect(lives(next)).toEqual([2, 3, 3]);
    }
  });

  it("applies a deadline that passed during a reload exactly once", () => {
    const stored: unknown = JSON.parse(JSON.stringify(inTurn()));
    expect(isSession(stored)).toBe(true);

    const reloaded = reduceSession(stored as Session, { type: "timeout", now: NOW + 60_000 });
    expect(lives(reloaded)).toEqual([2, 3, 3]);
    expect(reduceSession(reloaded, { type: "timeout", now: NOW + 60_001 })).toBe(reloaded);
  });
});

describe("pause", () => {
  function paused() {
    return reduceSession(inTurn(), { type: "pause", now: NOW + 4_000 });
  }

  it("keeps the remaining time and resumes from it", () => {
    const session = paused();
    expect(game(session).timer).toMatchObject({ deadlineMs: null, remainingMs: 6_000 });

    const resumed = reduceSession(session, { type: "resume", now: NOW + 100_000 });
    expect(game(resumed).timer.deadlineMs).toBe(NOW + 106_000);
  });

  it("blocks both results and the timeout while paused", () => {
    const session = paused();
    expect(reduceSession(session, { type: "right", now: NOW + 5_000 })).toBe(session);
    expect(reduceSession(session, { type: "wrong", now: NOW + 5_000 })).toBe(session);
    expect(reduceSession(session, { type: "timeout", now: NOW + 100_000 })).toBe(session);
  });

  it("does not pause a paused timer or resume a running one", () => {
    const session = paused();
    expect(reduceSession(session, { type: "pause", now: NOW + 5_000 })).toBe(session);

    const running = inTurn();
    expect(reduceSession(running, { type: "resume", now: NOW + 1_000 })).toBe(running);
  });
});

describe("after a lost life", () => {
  it("continues with a new category and the next player, ready", () => {
    const lost = reduceSession(inTurn(), { type: "wrong", now: NOW });
    const next = reduceSession(lost, { type: "continue" });

    expect(game(next)).toMatchObject({
      phase: "ready",
      currentIndex: 1,
      lastLoss: null,
      categoriesPlayed: 2,
    });
    expect(game(next).categoryId).not.toBe(game(lost).categoryId);
    expect(game(next).timer).toMatchObject({ remainingMs: TURN_MS, deadlineMs: null });
    expect(lives(next)).toEqual([2, 3, 3]);
  });

  it("says who plays next", () => {
    let session = inTurn(3, 1);
    session = reduceSession(session, { type: "wrong", now: NOW });
    expect(getNextPlayer(game(session))?.id).toBe("player-2");
  });

  it("skips a player with no lives on a right answer and on a new category", () => {
    let session = loseAndContinue(inTurn(4, 1));
    expect(lives(session)).toEqual([0, 1, 1, 1]);
    expect(game(session).currentIndex).toBe(1);

    session = reduceSession(session, { type: "right", now: NOW });
    session = reduceSession(session, { type: "right", now: NOW });
    expect(game(session).currentIndex).toBe(3);

    session = reduceSession(session, { type: "right", now: NOW });
    expect(game(session).currentIndex).toBe(1);

    session = reduceSession(session, { type: "right", now: NOW });
    session = loseAndContinue(session);
    expect(lives(session)).toEqual([0, 1, 0, 1]);
    expect(game(session).currentIndex).toBe(3);
  });

  it("repeats no category until all of them were used", () => {
    let session = createSession();
    const seen: string[] = [];

    while (seen.length < CATEGORIES.length) {
      session = reduceSession(session, {
        type: "start",
        players: createPlayers(10),
        seconds: SECONDS,
        lives: 3,
      });
      seen.push(game(session).categoryId);
      session = reduceSession(session, { type: "begin-turn", now: NOW });

      while (game(session).phase !== "finished" && seen.length < CATEGORIES.length) {
        session = reduceSession(session, { type: "wrong", now: NOW });
        if (game(session).phase === "life-lost") {
          session = reduceSession(session, { type: "continue" });
          seen.push(game(session).categoryId);
          session = reduceSession(session, { type: "begin-turn", now: NOW });
        }
      }
      session = reduceSession(session, { type: "end" });
    }

    expect(new Set(seen).size).toBe(CATEGORIES.length);
  });
});

describe("winning", () => {
  it("ends a two-player game when one of them runs out of lives", () => {
    let session = loseAndContinue(inTurn(2, 2));
    expect(game(session).currentIndex).toBe(1);

    session = loseAndContinue(session);
    expect(lives(session)).toEqual([1, 1]);

    session = reduceSession(session, { type: "wrong", now: NOW });
    expect(lives(session)).toEqual([0, 1]);
    expect(game(session)).toMatchObject({ phase: "finished", lastLoss: "mistake" });
    expect(getWinner(game(session))).toMatchObject({ id: "player-2", lives: 1 });
  });

  it("declares the last player with lives the winner, with final lives", () => {
    let session = inTurn(3, 2);
    session = reduceSession(session, { type: "right", now: NOW });
    session = loseAndContinue(session);
    expect(lives(session)).toEqual([2, 1, 2]);

    session = loseAndContinue(session);
    session = reduceSession(session, { type: "right", now: NOW });
    session = loseAndContinue(session);
    expect(lives(session)).toEqual([2, 0, 1]);

    session = reduceSession(session, { type: "right", now: NOW });
    session = loseAndContinue(session);
    expect(lives(session)).toEqual([1, 0, 1]);
    session = reduceSession(session, { type: "timeout", now: NOW + TURN_MS });

    expect(lives(session)).toEqual([1, 0, 0]);
    expect(game(session)).toMatchObject({ phase: "finished", lastLoss: "timeout" });
    expect(getWinner(game(session))).toMatchObject({ id: "player-1", lives: 1 });
  });

  it("has no winner while more than one player has lives", () => {
    expect(getWinner(game(inTurn()))).toBeUndefined();
  });

  it("keeps the deck when the game ends, so a new game avoids repeats", () => {
    const first = started();
    const ended = reduceSession(first, { type: "end" });
    expect(ended.game).toBeNull();

    const second = reduceSession(ended, {
      type: "start",
      players: createPlayers(3),
      seconds: SECONDS,
      lives: 3,
    });
    expect(game(second).categoryId).not.toBe(game(first).categoryId);
    expect(second.deck.remaining).toHaveLength(CATEGORIES.length - 2);
  });
});

describe("actions that do not fit the phase", () => {
  it("changes nothing without a game", () => {
    const session = createSession();
    expect(reduceSession(session, { type: "begin-turn", now: NOW })).toBe(session);
    expect(reduceSession(session, { type: "wrong", now: NOW })).toBe(session);
    expect(reduceSession(session, { type: "continue" })).toBe(session);
  });

  it("ignores results, timeouts, pause and continue while ready", () => {
    const session = started();
    expect(reduceSession(session, { type: "right", now: NOW })).toBe(session);
    expect(reduceSession(session, { type: "wrong", now: NOW })).toBe(session);
    expect(reduceSession(session, { type: "timeout", now: NOW })).toBe(session);
    expect(reduceSession(session, { type: "pause", now: NOW })).toBe(session);
    expect(reduceSession(session, { type: "resume", now: NOW })).toBe(session);
    expect(reduceSession(session, { type: "continue" })).toBe(session);
  });

  it("ignores begin-turn and continue during a turn", () => {
    const session = inTurn();
    expect(reduceSession(session, { type: "begin-turn", now: NOW })).toBe(session);
    expect(reduceSession(session, { type: "continue" })).toBe(session);
  });

  it("ignores everything but continue and end after a lost life", () => {
    const session = reduceSession(inTurn(), { type: "wrong", now: NOW });
    expect(reduceSession(session, { type: "begin-turn", now: NOW })).toBe(session);
    expect(reduceSession(session, { type: "right", now: NOW })).toBe(session);
    expect(reduceSession(session, { type: "pause", now: NOW })).toBe(session);
  });

  it("ignores everything but end once finished", () => {
    const session = reduceSession(inTurn(2, 1), { type: "wrong", now: NOW });
    expect(game(session).phase).toBe("finished");
    expect(reduceSession(session, { type: "continue" })).toBe(session);
    expect(reduceSession(session, { type: "begin-turn", now: NOW })).toBe(session);
    expect(reduceSession(session, { type: "wrong", now: NOW })).toBe(session);
    expect(reduceSession(session, { type: "end" }).game).toBeNull();
  });
});

describe("isSession", () => {
  it("accepts sessions in every phase and after a JSON round trip", () => {
    const paused = reduceSession(inTurn(), { type: "pause", now: NOW + 1_000 });
    const lost = reduceSession(inTurn(), { type: "wrong", now: NOW });
    const finished = reduceSession(inTurn(2, 1), { type: "wrong", now: NOW });

    for (const session of [createSession(), started(), inTurn(), paused, lost, finished]) {
      expect(isSession(session)).toBe(true);
      expect(isSession(JSON.parse(JSON.stringify(session)))).toBe(true);
    }
  });

  it("rejects malformed stored sessions", () => {
    const session = inTurn();
    const current = game(session);
    const withGame = (patch: object) => ({ ...session, game: { ...current, ...patch } });

    expect(isSession(null)).toBe(false);
    expect(isSession({ game: null })).toBe(false);
    expect(isSession({ deck: session.deck })).toBe(false);
    expect(isSession(withGame({ categoryId: "gone" }))).toBe(false);
    expect(isSession(withGame({ phase: "other" }))).toBe(false);
    expect(isSession(withGame({ seconds: 7 }))).toBe(false);
    expect(isSession(withGame({ maxLives: 9 }))).toBe(false);
    expect(isSession(withGame({ currentIndex: 3 }))).toBe(false);
    expect(isSession(withGame({ currentIndex: -1 }))).toBe(false);
    expect(isSession(withGame({ timer: { durationMs: "10" } }))).toBe(false);
    expect(isSession(withGame({ timer: { ...current.timer, durationMs: 5_000 } }))).toBe(false);
    expect(isSession(withGame({ players: "3" }))).toBe(false);
    expect(isSession(withGame({ players: [{ id: "player-1", name: "Ana" }] }))).toBe(false);
    expect(isSession(withGame({ categoriesPlayed: "1" }))).toBe(false);
    expect(isSession(withGame({ lastLoss: "other" }))).toBe(false);
  });

  it("rejects stored games that contradict their phase", () => {
    const session = inTurn(3, 2);
    const current = game(session);
    const withGame = (patch: object) => ({ ...session, game: { ...current, ...patch } });
    const withLives = (values: number[]) =>
      current.players.map((player, index) => ({ ...player, lives: values[index] }));

    expect(isSession(withGame({ players: withLives([3, 2, 2]) }))).toBe(false);
    expect(isSession(withGame({ players: withLives([-1, 2, 2]) }))).toBe(false);
    expect(isSession(withGame({ players: withLives([0, 2, 2]) }))).toBe(false);
    expect(isSession(withGame({ players: withLives([2, 0, 0]) }))).toBe(false);
    expect(isSession(withGame({ phase: "finished", lastLoss: "mistake" }))).toBe(false);
    expect(isSession(withGame({ phase: "life-lost", lastLoss: null }))).toBe(false);
    expect(isSession(withGame({ phase: "ready" }))).toBe(false);
  });
});
