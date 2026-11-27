import { describe, expect, it } from "vitest";

import { ALIVE_CONTEXTS, ALIVE_MESSAGES, fillMessage } from "@/content/alive-messages";
import {
  canAppear,
  DEFAULT_ALIVE_CONFIG,
  EMPTY_SESSION_LOG,
  getEligibleCharacters,
  isSessionLog,
  pickCharacter,
  pickMessage,
  pickResultReaction,
  planAppearance,
  recordAppearance,
  type AliveSessionLog,
} from "@/lib/alive/appearance-policy";
import {
  achievementKey,
  diffSeenAchievements,
  isSeenAchievements,
} from "@/lib/alive/seen-achievements";
import { createPersistentStore } from "@/lib/storage";
import type { CharacterId } from "@/types/character";

const ALL: CharacterId[] = ["rama", "aguysan", "nehue", "pili", "piku", "chino", "agusmaxi"];
const first = () => 0;
const last = () => 0.999;

const base = { now: 1_000_000, matchInProgress: false, all: ALL, random: first };

describe("character choice", () => {
  it("prefers the characters marked present", () => {
    expect(getEligibleCharacters(["pili", "chino"], ALL)).toEqual(["pili", "chino"]);
    expect(pickCharacter(["pili", "chino"], ALL, null, last)).toBe("chino");
  });

  it("falls back to all seven when nobody is present", () => {
    expect(getEligibleCharacters([], ALL)).toEqual(ALL);
    expect(pickCharacter([], ALL, null, first)).toBe("rama");
  });

  it("does not repeat the last character when there is an alternative", () => {
    expect(pickCharacter(["pili", "chino"], ALL, "pili", first)).toBe("chino");
    expect(pickCharacter(["pili"], ALL, "pili", first)).toBe("pili");
  });

  it("does not repeat the last message when there is an alternative", () => {
    const [one, two] = ALIVE_MESSAGES.welcome;
    expect(pickMessage("welcome", one.id, first)?.id).toBe(two.id);
  });
});

describe("frequency rules", () => {
  const shownOnce = recordAppearance(
    EMPTY_SESSION_LOG,
    { context: "welcome", characterId: "rama", message: ALIVE_MESSAGES.welcome[0] },
    base.now,
  );

  it("waits for the cooldown between decorative appearances", () => {
    const gate = { matchInProgress: false };
    expect(canAppear(shownOnce, "hallVisit", { ...gate, now: base.now + 1_000 })).toBe(false);
    expect(
      canAppear(shownOnce, "hallVisit", { ...gate, now: base.now + DEFAULT_ALIVE_CONFIG.cooldownMs }),
    ).toBe(true);
  });

  it("honors a configured cooldown", () => {
    const config = { cooldownMs: 10, sessionLimit: 10 };
    expect(canAppear(shownOnce, "hallVisit", { now: base.now + 10, matchInProgress: false, config })).toBe(true);
  });

  it("stops at the session limit", () => {
    const full: AliveSessionLog = { ...EMPTY_SESSION_LOG, count: DEFAULT_ALIVE_CONFIG.sessionLimit };
    expect(canAppear(full, "welcome", { now: base.now, matchInProgress: false })).toBe(false);
  });

  it("shows each context once per session, so navigating back home stays quiet", () => {
    expect(
      canAppear(shownOnce, "welcome", { now: base.now + 10 * DEFAULT_ALIVE_CONFIG.cooldownMs, matchInProgress: false }),
    ).toBe(false);
  });

  it("stays quiet while a match is being played", () => {
    expect(
      planAppearance({ ...base, context: "welcome", log: EMPTY_SESSION_LOG, present: [], matchInProgress: true }),
    ).toBeNull();
  });

  it("plans and records an appearance", () => {
    const appearance = planAppearance({ ...base, context: "welcome", log: EMPTY_SESSION_LOG, present: ["piku"] });
    expect(appearance).toEqual({ context: "welcome", characterId: "piku", message: ALIVE_MESSAGES.welcome[0] });
    const log = recordAppearance(EMPTY_SESSION_LOG, appearance!, base.now);
    expect(log).toEqual({
      count: 1,
      lastAt: base.now,
      lastCharacterId: "piku",
      lastMessageId: "welcome-1",
      shown: ["welcome"],
    });
  });
});

describe("result reactions", () => {
  it("celebrates a winner", () => {
    expect(pickResultReaction({ winners: [{ id: "nehue" }], tied: [], losers: [{ id: "pili" }] }, first)).toEqual({
      context: "victory",
      characterId: "nehue",
    });
  });

  it("gives no victory line to a social game without winners", () => {
    expect(pickResultReaction({ winners: [], tied: [], losers: [] }, first)).toBeNull();
  });

  it("gives no line to a tie", () => {
    expect(pickResultReaction({ winners: [], tied: [{ id: "rama" }], losers: [] }, first)).toBeNull();
  });

  it("consoles when everyone lost", () => {
    expect(pickResultReaction({ winners: [], tied: [], losers: [{ id: "chino" }] }, first)).toEqual({
      context: "defeat",
      characterId: "chino",
    });
  });
});

describe("seen achievements", () => {
  const firstWin = achievementKey("rama", "first-win");
  const veteran = achievementKey("pili", "veteran");

  it("initializes on the first read without celebrating the past", () => {
    expect(diffSeenAchievements([firstWin, veteran], null)).toEqual({ fresh: [], next: [firstWin, veteran] });
  });

  it("celebrates only achievements not seen before", () => {
    expect(diffSeenAchievements([firstWin, veteran], [firstWin])).toEqual({
      fresh: [veteran],
      next: [firstWin, veteran],
    });
  });

  it("does not celebrate again after the registry is saved", () => {
    const { next } = diffSeenAchievements([firstWin, veteran], [firstWin]);
    expect(diffSeenAchievements([firstWin, veteran], next).fresh).toEqual([]);
  });

  it("treats corrupt stored data as uninitialized, so nothing is celebrated", () => {
    const storage = new Map<string, string>([["seen", JSON.stringify({ version: 1, data: [1, 2] })]]);
    const store = createPersistentStore({
      key: "seen",
      version: 1,
      fallback: null,
      validate: isSeenAchievements,
      getStorage: () => ({ getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) }),
    });
    expect(store.get()).toBeNull();
    expect(diffSeenAchievements([firstWin], store.get()).fresh).toEqual([]);
  });
});

describe("persisted session log", () => {
  it("accepts a valid log and rejects invalid data", () => {
    expect(isSessionLog(EMPTY_SESSION_LOG)).toBe(true);
    expect(isSessionLog({ ...EMPTY_SESSION_LOG, shown: ["not-a-context"] })).toBe(false);
    expect(isSessionLog({ ...EMPTY_SESSION_LOG, count: "3" })).toBe(false);
    expect(isSessionLog(null)).toBe(false);
  });
});

describe("messages", () => {
  it("has short lines for every context", () => {
    for (const context of ALIVE_CONTEXTS) {
      expect(ALIVE_MESSAGES[context].length).toBeGreaterThan(1);
      for (const message of ALIVE_MESSAGES[context]) expect(message.text.length).toBeLessThanOrEqual(70);
    }
  });

  it("fills names and achievements", () => {
    expect(fillMessage("¡{name} desbloqueó {achievement}!", { name: "Pili", achievement: "Veterano" })).toBe(
      "¡Pili desbloqueó Veterano!",
    );
  });
});
