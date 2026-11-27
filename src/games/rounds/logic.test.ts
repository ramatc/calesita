import { describe, expect, it } from "vitest";

import {
  createRoundsGame,
  createSession,
  getLeaders,
  getTurnParticipant,
  type Action,
  type Session,
} from "@/games/rounds/logic";

const NOW = 1_000_000;
const TIMED = ["t1", "t2", "t3"];
const UNTIMED = ["u1", "u2", "u3"];

const timed = createRoundsGame({ cardIds: TIMED, getTimerSeconds: () => 30 }, "test:timed");
const untimed = createRoundsGame({ cardIds: UNTIMED, getTimerSeconds: () => undefined }, "test:untimed");

const PARTICIPANTS = [
  { id: "a", name: "Ana", seatIds: ["player-1"] },
  { id: "b", name: "Beto", seatIds: ["player-2"] },
];

function start(rules = timed, rounds = 2) {
  return rules.reduceSession(createSession(), { type: "start", participants: PARTICIPANTS, rounds });
}

function apply(rules: typeof timed, session: Session, ...actions: Action[]) {
  return actions.reduce(rules.reduceSession, session);
}

describe("rounds game", () => {
  it("starts with zero scores, round 1 and a dealt card", () => {
    const { game } = start();
    expect(game?.participants.map((p) => p.score)).toEqual([0, 0]);
    expect(game?.round).toBe(1);
    expect(TIMED).toContain(game?.cardId);
    expect(game?.phase).toBe("ready");
  });

  it("stops the clock when the last round is awarded mid-run, so the result survives a reload", () => {
    const session = apply(
      timed,
      start(timed, 1),
      { type: "start-timer", now: NOW },
      { type: "award", winnerIds: ["a"] },
    );
    expect(session.game?.phase).toBe("finished");
    expect(session.game?.timer?.deadlineMs).toBeNull();
    expect(timed.isSession(session)).toBe(true);
  });

  it("does not award before the clock starts on a timed card", () => {
    const session = start();
    expect(timed.reduceSession(session, { type: "award", winnerIds: ["a"] })).toBe(session);
  });

  it("awards a point to each winner, deals a new card and advances the round", () => {
    const session = apply(timed, start(), { type: "start-timer", now: NOW }, { type: "award", winnerIds: ["a", "b", "ghost"] });
    expect(session.game?.participants.map((p) => p.score)).toEqual([1, 1]);
    expect(session.game?.round).toBe(2);
    expect(session.game?.phase).toBe("ready");
  });

  it("lets nobody score with an empty list", () => {
    const session = apply(timed, start(), { type: "start-timer", now: NOW }, { type: "award", winnerIds: [] });
    expect(session.game?.participants.map((p) => p.score)).toEqual([0, 0]);
  });

  it("moves to judging when the clock runs out, not before", () => {
    const running = apply(timed, start(), { type: "start-timer", now: NOW });
    expect(timed.reduceSession(running, { type: "expire", now: NOW + 1000 })).toBe(running);
    expect(timed.reduceSession(running, { type: "expire", now: NOW + 30_000 }).game?.phase).toBe("judging");
  });

  it("finishes after the last round and names the leaders", () => {
    const session = apply(
      untimed,
      start(untimed, 2),
      { type: "award", winnerIds: ["b"] },
      { type: "award", winnerIds: ["b"] },
    );
    expect(session.game?.phase).toBe("finished");
    expect(getLeaders(session.game!).map((p) => p.name)).toEqual(["Beto"]);
    expect(untimed.reduceSession(session, { type: "award", winnerIds: ["a"] })).toBe(session);
  });

  it("goes straight to judging on untimed cards", () => {
    expect(start(untimed).game?.phase).toBe("judging");
    expect(start(untimed).game?.timer).toBeNull();
  });

  it("rotates the turn participant by round", () => {
    const first = start(untimed, 3);
    const second = untimed.reduceSession(first, { type: "award", winnerIds: [] });
    const third = untimed.reduceSession(second, { type: "award", winnerIds: [] });
    expect([first, second, third].map((s) => getTurnParticipant(s.game!).id)).toEqual(["a", "b", "a"]);
  });

  it("validates stored sessions of its own content only", () => {
    expect(timed.isSession(start())).toBe(true);
    expect(untimed.isSession(start())).toBe(false);
    expect(timed.isSession({ deck: start().deck, game: null })).toBe(true);
  });
});
