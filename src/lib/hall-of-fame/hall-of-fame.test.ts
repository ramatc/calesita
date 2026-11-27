import { describe, expect, it } from "vitest";

import { getAchievements, getLongestWinStreak } from "@/lib/hall-of-fame/achievements";
import { getRanking, getRecentMatches, MIN_RANKED_MATCHES } from "@/lib/hall-of-fame/ranking";
import { getAllCharacterStats, getCharacterStats } from "@/lib/hall-of-fame/stats";
import {
  createMatchHistoryStore,
  getMatchHistory,
  type MatchDraft,
  type MatchResult,
} from "@/lib/match-history";
import { decidedResult, scoredPlayersResult, scoredTeamsResult, socialResult } from "@/lib/match-result";
import type { SeatIdentity } from "@/lib/character-cast";

const rama: SeatIdentity = { seatId: "s1", name: "Rama", kind: "character", refId: "rama" };
const pili: SeatIdentity = { seatId: "s2", name: "Pili", kind: "character", refId: "pili" };
const chino: SeatIdentity = { seatId: "s3", name: "Chino", kind: "character", refId: "chino" };
const nehue: SeatIdentity = { seatId: "s4", name: "Nehue", kind: "character", refId: "nehue" };
const guest: SeatIdentity = { seatId: "s5", name: "Lu", kind: "guest", refId: "guest-1" };
const generic: SeatIdentity = { seatId: "s6", name: "Jugador 6", kind: "generic" };

let counter = 0;
function match(draft: MatchDraft, overrides: Partial<MatchResult> = {}): MatchResult {
  counter += 1;
  return {
    ...draft,
    id: `match-${counter}`,
    playedAt: new Date(Date.UTC(2026, 0, 1, 0, counter)).toISOString(),
    ...overrides,
  };
}

function players(scores: [SeatIdentity, number][], game = "preguntados-calesita") {
  return match(scoredPlayersResult(game, scores.map(([seat, score]) => ({ ...seat, score }))));
}

function teams(scores: [number, number], game = "actua-o-perdes") {
  return match(
    scoredTeamsResult(
      game,
      [
        { id: "t1", name: "Rojo", seatIds: ["s1", "s2"], score: scores[0] },
        { id: "t2", name: "Azul", seatIds: ["s3", "s4"], score: scores[1] },
      ],
      [rama, pili, chino, nehue],
    ),
  );
}

const stats = (history: MatchResult[], id: Parameters<typeof getCharacterStats>[1]) =>
  getCharacterStats(history, id);

describe("character stats", () => {
  it("counts an individual win for the winner and a loss for the rest", () => {
    const history = [players([[rama, 5], [pili, 2], [chino, 1]])];
    expect(stats(history, "rama")).toMatchObject({ played: 1, eligible: 1, wins: 1, losses: 0, ties: 0, winRate: 1 });
    expect(stats(history, "pili")).toMatchObject({ played: 1, eligible: 1, wins: 0, losses: 1, winRate: 0 });
  });

  it("gives a team win to every member of the winning team only", () => {
    const history = [teams([4, 2])];
    expect(stats(history, "rama").wins).toBe(1);
    expect(stats(history, "pili").wins).toBe(1);
    expect(stats(history, "chino")).toMatchObject({ wins: 0, losses: 1 });
    expect(stats(history, "nehue")).toMatchObject({ wins: 0, losses: 1 });
  });

  it("scores a shared top as a tie and the rest as losses", () => {
    const history = [players([[rama, 3], [pili, 3], [chino, 1]])];
    expect(stats(history, "rama")).toMatchObject({ wins: 0, ties: 1, losses: 0, eligible: 1, winRate: 0 });
    expect(stats(history, "chino")).toMatchObject({ ties: 0, losses: 1 });
    const teamTie = [teams([2, 2])];
    expect(stats(teamTie, "rama").ties).toBe(1);
    expect(stats(teamTie, "chino").ties).toBe(1);
  });

  it("counts social games only as participations", () => {
    const history = [match(socialResult("quien-es-mas-probable-que", [rama, pili]))];
    expect(stats(history, "rama")).toMatchObject({ played: 1, eligible: 0, losses: 0, winRate: null });
  });

  it("never scores a match without a winner", () => {
    const history = [
      players([[rama, 0], [pili, 0]]),
      match(decidedResult("categorias-explosivas", [rama, pili], [])),
    ];
    expect(stats(history, "rama")).toMatchObject({ played: 2, eligible: 0, wins: 0, losses: 0, ties: 0 });
  });

  it("never scores a result whose winners do not add up", () => {
    const base = teams([4, 2]);
    const history = [
      // Winning team id that does not exist.
      { ...base, id: "bad-1", winnerTeamIds: ["t9"] },
      // Winning seats that are not the winning team.
      { ...base, id: "bad-2", winnerSeatIds: ["s1", "s3"] },
      // A win with two winning teams.
      { ...base, id: "bad-3", winnerTeamIds: ["t1", "t2"], winnerSeatIds: ["s1", "s2", "s3", "s4"] },
      // A winner who did not play.
      { ...players([[rama, 2], [pili, 1]]), id: "bad-4", winnerSeatIds: ["s9"] },
      // A competitive result marked social.
      { ...players([[rama, 2], [pili, 1]]), id: "bad-5", outcome: "social" as const },
    ];
    for (const id of ["rama", "pili", "chino", "nehue"] as const) {
      expect(stats(history, id)).toMatchObject({ eligible: 0, wins: 0, losses: 0, ties: 0 });
    }
  });

  it("keeps guests and generic players out of the stats without breaking others", () => {
    const history = [players([[guest, 5], [rama, 2], [generic, 1]])];
    expect(stats(history, "rama")).toMatchObject({ wins: 0, losses: 1 });
    const all = getAllCharacterStats(history);
    expect(all).toHaveLength(7);
    expect(all.reduce((total, entry) => total + entry.played, 0)).toBe(1);
  });

  it("counts a repeated match id once", () => {
    const once = players([[rama, 3], [pili, 1]]);
    expect(stats([once, { ...once }, { ...once }], "rama")).toMatchObject({ played: 1, wins: 1 });
  });

  it("uses wins over eligible matches as the win rate", () => {
    const history = [
      players([[rama, 3], [pili, 1]]),
      players([[rama, 1], [pili, 3]]),
      players([[rama, 2], [pili, 2]]),
      match(socialResult("challenge-turns", [rama, pili])),
      players([[rama, 0], [pili, 0]]),
    ];
    expect(stats(history, "rama")).toMatchObject({ played: 5, eligible: 3, wins: 1, losses: 1, ties: 1 });
    expect(stats(history, "rama").winRate).toBeCloseTo(1 / 3);
  });

  it("lists the most played games first", () => {
    const history = [
      players([[rama, 1], [pili, 0]], "b-game"),
      players([[rama, 1], [pili, 0]], "a-game"),
      players([[rama, 1], [pili, 0]], "a-game"),
    ];
    expect(stats(history, "rama").topGames).toEqual([
      { game: "a-game", played: 2 },
      { game: "b-game", played: 1 },
    ]);
  });

  it("returns empty stats for every character with an empty history", () => {
    for (const entry of getAllCharacterStats([])) {
      expect(entry).toMatchObject({ played: 0, eligible: 0, wins: 0, winRate: null, matches: [] });
    }
  });

  it("only reads valid entries from a corrupt stored history", () => {
    const valid = players([[rama, 3], [pili, 1]]);
    const values = new Map([
      [
        "calesita:match-history",
        JSON.stringify({ version: 1, data: [valid, { id: "x" }, null, "nope", { ...valid, playedAt: "never" }] }),
      ],
    ]);
    const store = createMatchHistoryStore(() => ({
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => void values.set(key, value),
    }));
    expect(stats(getMatchHistory(store), "rama")).toMatchObject({ played: 1, wins: 1 });
  });
});

describe("ranking", () => {
  const rows = (history: MatchResult[], options?: Parameters<typeof getRanking>[1]) =>
    getRanking(history, options).map((entry) => [entry.stats.characterId, entry.position]);

  it("always lists the seven characters", () => {
    expect(getRanking([])).toHaveLength(7);
  });

  it("orders by wins and breaks ties by eligible matches, wins and name", () => {
    const history = [
      players([[rama, 3], [pili, 1]]),
      players([[chino, 3], [nehue, 1]]),
      players([[chino, 1], [nehue, 3]]),
    ];
    const order = rows(history).slice(0, 4);
    // Chino and Nehue: 1 win, 2 eligible. Rama: 1 win, 1 eligible.
    expect(order).toEqual([["chino", 1], ["nehue", 2], ["rama", 3], ["pili", 4]]);
  });

  it("leaves characters without enough matches unranked by win rate", () => {
    const history = Array.from({ length: MIN_RANKED_MATCHES }, () => players([[rama, 1], [pili, 3]]));
    history.push(players([[chino, 3], [nehue, 1]]));
    const ranking = getRanking(history, { criterion: "win-rate" });
    expect(ranking[0]).toMatchObject({ stats: { characterId: "pili" }, position: 1 });
    expect(ranking[1]).toMatchObject({ stats: { characterId: "rama" }, position: 2 });
    expect(ranking.find((entry) => entry.stats.characterId === "chino")?.position).toBeNull();
    // With a lower minimum Chino ranks; equal 100% rates fall to more eligible matches.
    const relaxed = getRanking(history, { criterion: "win-rate", minMatches: 1 });
    expect(relaxed.slice(0, 2).map((entry) => [entry.stats.characterId, entry.position])).toEqual([
      ["pili", 1],
      ["chino", 2],
    ]);
  });

  it("ranks by participations, social games included", () => {
    const history = [match(socialResult("challenge-turns", [pili])), match(socialResult("challenge-turns", [pili]))];
    expect(rows(history, { criterion: "played" })[0]).toEqual(["pili", 1]);
  });

  it("filters by game", () => {
    const history = [players([[rama, 3], [pili, 1]], "a-game"), players([[pili, 3], [rama, 1]], "b-game")];
    expect(rows(history, { game: "b-game" })[0]).toEqual(["pili", 1]);
  });
});

describe("history", () => {
  it("lists the most recent first and filters by character and game", () => {
    const first = players([[rama, 3], [pili, 1]], "a-game");
    const second = players([[chino, 3], [pili, 1]], "b-game");
    expect(getRecentMatches([first, second]).map((entry) => entry.id)).toEqual([second.id, first.id]);
    expect(getRecentMatches([first, second], { characterId: "rama" })).toEqual([first]);
    expect(getRecentMatches([first, second], { game: "b-game" })).toEqual([second]);
    expect(getRecentMatches([])).toEqual([]);
  });
});

describe("achievements", () => {
  const win = () => players([[rama, 3], [pili, 1]]);
  const loss = () => players([[rama, 1], [pili, 3]]);
  const tie = () => players([[rama, 2], [pili, 2]]);
  const social = () => match(socialResult("challenge-turns", [rama, pili]));
  const noWinner = () => players([[rama, 0], [pili, 0]]);
  const unlocked = (history: MatchResult[]) =>
    getAchievements(stats(history, "rama")).filter((entry) => entry.unlocked).map((entry) => entry.id);

  it("unlocks nothing with an empty history", () => {
    expect(unlocked([])).toEqual([]);
    expect(getAchievements(stats([], "rama")).every((entry) => entry.progress === 0)).toBe(true);
  });

  it("unlocks the first win", () => {
    expect(unlocked([loss()])).toEqual([]);
    expect(unlocked([win()])).toEqual(["first-win"]);
  });

  it("needs three wins in a row for Invicto", () => {
    expect(getLongestWinStreak(stats([win(), win(), loss(), win()], "rama"))).toBe(2);
    expect(getLongestWinStreak(stats([win(), win(), tie(), win()], "rama"))).toBe(2);
    expect(unlocked([win(), win(), win()])).toContain("unbeaten");
  });

  it("does not break or extend a streak with social or undecided games", () => {
    const history = [win(), social(), win(), noWinner(), win()];
    expect(getLongestWinStreak(stats(history, "rama"))).toBe(3);
    expect(getLongestWinStreak(stats([win(), social(), social()], "rama"))).toBe(1);
  });

  it("unlocks Veterano at 20 matches, social ones included", () => {
    expect(unlocked(Array.from({ length: 19 }, social))).not.toContain("veteran");
    expect(unlocked(Array.from({ length: 20 }, social))).toContain("veteran");
  });

  it("unlocks Todoterreno at four different games", () => {
    const games = ["a", "b", "c"].map((game) => players([[rama, 0], [pili, 1]], game));
    expect(unlocked(games)).not.toContain("all-rounder");
    expect(unlocked([...games, players([[rama, 0], [pili, 1]], "d")])).toContain("all-rounder");
  });

  it("unlocks Especialista at five wins of one game, not spread across games", () => {
    const spread = ["a", "b", "c", "d", "e"].map((game) => players([[rama, 3], [pili, 1]], game));
    expect(unlocked(spread)).not.toContain("specialist");
    expect(unlocked(Array.from({ length: 5 }, win))).toContain("specialist");
  });

  it("unlocks Leyenda de la Barra at 25 wins and reports capped progress", () => {
    const history = Array.from({ length: 24 }, win);
    const legend = () => getAchievements(stats(history, "rama")).find((entry) => entry.id === "legend")!;
    expect(legend()).toMatchObject({ unlocked: false, progress: 24, goal: 25 });
    history.push(win(), win());
    expect(legend()).toMatchObject({ unlocked: true, progress: 25 });
  });
});
