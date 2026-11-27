import { beforeEach, describe, expect, it } from "vitest";

import {
  createMatchHistoryStore,
  createMatchTracker,
  getMatchHistory,
  isMatchResult,
  MAX_STORED_MATCHES,
  recordMatch,
  type MatchResult,
} from "@/lib/match-history";
import { scoredPlayersResult, socialResult } from "@/lib/match-result";
import { createPersistentStore } from "@/lib/storage";

function fakeStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
    values,
  };
}

function sampleResult(id = "match-1"): MatchResult {
  return {
    ...scoredPlayersResult("mimica", [
      { seatId: "player-1", name: "Rama", kind: "character", refId: "rama", score: 3 },
      { seatId: "player-2", name: "Lu", kind: "guest", refId: "guest-1", score: 1 },
    ]),
    id,
    playedAt: "2026-11-27T21:00:00.000Z",
  };
}

describe("match history persistence", () => {
  let storage: ReturnType<typeof fakeStorage>;

  beforeEach(() => {
    storage = fakeStorage();
  });

  it("stores results in a versioned envelope that a fresh store reads back", () => {
    recordMatch(sampleResult(), createMatchHistoryStore(() => storage));

    const raw = JSON.parse(storage.values.get("calesita:match-history") ?? "null");
    expect(raw.version).toBe(1);
    expect(getMatchHistory(createMatchHistoryStore(() => storage))).toEqual([sampleResult()]);
  });

  it("records a match id only once", () => {
    const store = createMatchHistoryStore(() => storage);
    expect(recordMatch(sampleResult(), store)).toBe(true);
    expect(recordMatch(sampleResult(), store)).toBe(false);
    expect(getMatchHistory(store)).toHaveLength(1);
  });

  it("drops invalid entries without losing the valid ones", () => {
    storage = fakeStorage({
      "calesita:match-history": JSON.stringify({
        version: 1,
        data: [sampleResult("good"), { id: "bad" }, null, { ...sampleResult("x"), outcome: "lol" }],
      }),
    });
    expect(getMatchHistory(createMatchHistoryStore(() => storage)).map(({ id }) => id)).toEqual([
      "good",
    ]);
  });

  it("falls back to an empty history on corrupt or older data", () => {
    const corrupt = fakeStorage({ "calesita:match-history": "{oops" });
    const older = fakeStorage({
      "calesita:match-history": JSON.stringify({ version: 0, data: [sampleResult()] }),
    });
    expect(getMatchHistory(createMatchHistoryStore(() => corrupt))).toEqual([]);
    expect(getMatchHistory(createMatchHistoryStore(() => older))).toEqual([]);
  });

  it("refuses to record an invalid result", () => {
    const store = createMatchHistoryStore(() => storage);
    expect(recordMatch({ ...sampleResult(), playedAt: "not a date" }, store)).toBe(false);
    expect(getMatchHistory(store)).toEqual([]);
  });

  it("keeps only the most recent matches", () => {
    const store = createMatchHistoryStore(() => storage);
    for (let index = 0; index < MAX_STORED_MATCHES + 2; index += 1) {
      recordMatch(sampleResult(`match-${index}`), store);
    }
    const history = getMatchHistory(store);
    expect(history).toHaveLength(MAX_STORED_MATCHES);
    expect(history[0].id).toBe("match-2");
  });
});

describe("createMatchTracker", () => {
  function setup() {
    const pending = createPersistentStore<Record<string, string>>({
      key: "pending",
      version: 1,
      fallback: {},
      validate: (value): value is Record<string, string> =>
        typeof value === "object" && value !== null,
      getStorage: () => undefined,
    });
    const history = createMatchHistoryStore(() => undefined);
    const tracker = createMatchTracker(pending, history, () => new Date("2026-11-27T22:00:00Z"));
    const draft = socialResult("charadas", [
      { seatId: "player-1", name: "Jugador 1", kind: "generic" },
    ]);
    return { pending, history, tracker, draft };
  }

  it("records a finished match once, even when the results screen shows again", () => {
    const { history, tracker, draft } = setup();
    tracker.begin("charadas");

    const first = tracker.finish("charadas", draft);
    const again = tracker.finish("charadas", draft);

    expect(first && isMatchResult(first)).toBe(true);
    expect(first?.playedAt).toBe("2026-11-27T22:00:00.000Z");
    expect(again).toBeNull();
    expect(getMatchHistory(history)).toHaveLength(1);
  });

  it("never records a game that was not seen being played", () => {
    const { history, tracker, draft } = setup();
    expect(tracker.finish("charadas", draft)).toBeNull();
    expect(getMatchHistory(history)).toEqual([]);
  });

  it("keeps the id of a match in progress, and gives the next match a new one", () => {
    const { pending, tracker, draft } = setup();
    tracker.begin("charadas");
    const id = pending.get().charadas;
    tracker.begin("charadas");
    expect(pending.get().charadas).toBe(id);

    tracker.finish("charadas", draft);
    tracker.begin("charadas");
    expect(pending.get().charadas).not.toBe(id);
  });

  it("tracks each game on its own", () => {
    const { history, tracker, draft } = setup();
    tracker.begin("charadas");
    tracker.begin("mimica");
    tracker.finish("charadas", draft);
    expect(tracker.finish("mimica", { ...draft, game: "mimica" })?.game).toBe("mimica");
    expect(getMatchHistory(history)).toHaveLength(2);
  });
});
