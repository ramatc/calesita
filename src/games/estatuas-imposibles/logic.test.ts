import { describe, expect, it } from "vitest";

import { CHALLENGES, getChallenge, RULES } from "@/content/estatuas-imposibles";
import { createSession } from "@/games/challenge-turns/logic";
import { isSession, reduceSession } from "@/games/estatuas-imposibles/logic";
import { createPlayers } from "@/games/players";

const NOW = 1_000_000;

function started() {
  const session = reduceSession(createSession(), {
    type: "start",
    players: createPlayers(3),
    difficulty: "mixed",
  });
  if (!session.game) throw new Error("expected a game");
  return session;
}

describe("estatuas-imposibles content", () => {
  it("has unique ids, a timer on every card and every difficulty", () => {
    expect(new Set(CHALLENGES.map((item) => item.id)).size).toBe(CHALLENGES.length);
    expect(CHALLENGES.every((item) => (item.timerSeconds ?? 0) > 0)).toBe(true);
    for (const level of ["easy", "medium", "hard"]) {
      expect(CHALLENGES.some((item) => item.difficulty === level)).toBe(true);
    }
    expect(RULES.length).toBeGreaterThan(0);
  });
});

describe("estatuas-imposibles game", () => {
  it("deals a card of its own content, with its timer", () => {
    const { game } = started();
    expect(getChallenge(game!.challengeId)).toBeDefined();
    expect(game!.timer?.durationMs).toBe((getChallenge(game!.challengeId)?.timerSeconds ?? 0) * 1000);
  });

  it("scores a completed card for the player in turn and passes the turn", () => {
    const running = reduceSession(started(), { type: "start-timer", now: NOW });
    const next = reduceSession(running, { type: "resolve", outcome: "completed" });
    expect(next.game?.tallies[0].completed).toBe(1);
    expect(next.game?.turn).toBe(1);
  });

  it("refuses to mark a result before the clock starts, but allows skipping", () => {
    const session = started();
    expect(reduceSession(session, { type: "resolve", outcome: "completed" })).toBe(session);
    expect(reduceSession(session, { type: "resolve", outcome: "skipped" }).game?.tallies[0].skipped).toBe(1);
  });

  it("validates its own stored sessions only", () => {
    expect(isSession(started())).toBe(true);
    const foreign = { ...started(), game: { ...started().game!, challengeId: "des-001" } };
    expect(isSession(foreign)).toBe(false);
  });
});
