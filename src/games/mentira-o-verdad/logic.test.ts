import { describe, expect, it } from "vitest";

import { CHALLENGES, getChallenge, RULES } from "@/content/mentira-o-verdad";
import { createSession } from "@/games/challenge-turns/logic";
import { isSession, reduceSession } from "@/games/mentira-o-verdad/logic";
import { createPlayers } from "@/games/players";

function started() {
  return reduceSession(createSession(), {
    type: "start",
    players: createPlayers(3),
    difficulty: "mixed",
  });
}

describe("mentira-o-verdad content", () => {
  it("has unique ids and titles, and every difficulty", () => {
    expect(new Set(CHALLENGES.map((item) => item.id)).size).toBe(CHALLENGES.length);
    expect(new Set(CHALLENGES.map((item) => item.title)).size).toBe(CHALLENGES.length);
    expect(CHALLENGES.every((item) => item.timerSeconds === undefined)).toBe(true);
    for (const level of ["easy", "medium", "hard"]) {
      expect(CHALLENGES.some((item) => item.difficulty === level)).toBe(true);
    }
    expect(RULES.length).toBeGreaterThan(0);
  });
});

describe("mentira-o-verdad game", () => {
  it("deals a card of its own content", () => {
    expect(getChallenge(started().game?.challengeId ?? "")).toBeDefined();
  });

  it("marks a story right away, with no clock, and passes the turn", () => {
    const session = started();
    expect(session.game?.timer).toBeNull();
    const next = reduceSession(session, { type: "resolve", outcome: "failed" });
    expect(next.game?.tallies[0].failed).toBe(1);
    expect(next.game?.turn).toBe(1);
  });

  it("validates its own stored sessions only", () => {
    const session = started();
    expect(isSession(session)).toBe(true);
    const foreign = { ...session, game: { ...session.game!, challengeId: "des-001" } };
    expect(isSession(foreign)).toBe(false);
  });
});
