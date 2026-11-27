import { describe, expect, it } from "vitest";

import { CHALLENGES, getChallenge, RULES } from "@/content/defende-lo-indefendible";
import { createSession } from "@/games/challenge-turns/logic";
import { isSession, reduceSession } from "@/games/defende-lo-indefendible/logic";
import { createPlayers } from "@/games/players";

const NOW = 1_000_000;

function started() {
  return reduceSession(createSession(), {
    type: "start",
    players: createPlayers(3),
    difficulty: "mixed",
  });
}

describe("defende-lo-indefendible content", () => {
  it("has unique ids and titles, and every difficulty", () => {
    expect(new Set(CHALLENGES.map((item) => item.id)).size).toBe(CHALLENGES.length);
    expect(new Set(CHALLENGES.map((item) => item.title)).size).toBe(CHALLENGES.length);
    expect(CHALLENGES.every((item) => (item.timerSeconds ?? 0) > 0)).toBe(true);
    for (const level of ["easy", "medium", "hard"]) {
      expect(CHALLENGES.some((item) => item.difficulty === level)).toBe(true);
    }
    expect(RULES.length).toBeGreaterThan(0);
  });
});

describe("defende-lo-indefendible game", () => {
  it("deals a card of its own content", () => {
    expect(getChallenge(started().game?.challengeId ?? "")).toBeDefined();
  });

  it("scores a convinced speech once the clock started, and passes the turn", () => {
    const session = started();
    expect(reduceSession(session, { type: "resolve", outcome: "completed" })).toBe(session);
    const running = reduceSession(session, { type: "start-timer", now: NOW });
    const next = reduceSession(running, { type: "resolve", outcome: "completed" });
    expect(next.game?.tallies[0].completed).toBe(1);
    expect(next.game?.turn).toBe(1);
  });

  it("validates its own stored sessions only", () => {
    const session = started();
    expect(isSession(session)).toBe(true);
    const foreign = { ...session, game: { ...session.game!, challengeId: "des-001" } };
    expect(isSession(foreign)).toBe(false);
  });
});
