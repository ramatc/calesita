import { describe, expect, it } from "vitest";

import type { SeatIdentity } from "@/lib/character-cast";
import {
  decidedResult,
  getScoreOutcome,
  scoredPlayersResult,
  scoredTeamsResult,
  socialResult,
} from "@/lib/match-result";

const rama: SeatIdentity = { seatId: "player-1", name: "Rama", kind: "character", refId: "rama" };
const lu: SeatIdentity = { seatId: "player-2", name: "Lu", kind: "guest", refId: "guest-1" };
const third: SeatIdentity = { seatId: "player-3", name: "Jugador 3", kind: "generic" };
const fourth: SeatIdentity = { seatId: "player-4", name: "Jugador 4", kind: "generic" };

describe("getScoreOutcome", () => {
  it("has one winner, a tie, or no winner when nobody scored", () => {
    expect(getScoreOutcome([3, 1])).toEqual({ outcome: "win", leaders: [0] });
    expect(getScoreOutcome([2, 2, 1])).toEqual({ outcome: "tie", leaders: [0, 1] });
    expect(getScoreOutcome([0, 0])).toEqual({ outcome: "no-winner", leaders: [] });
    expect(getScoreOutcome([])).toEqual({ outcome: "no-winner", leaders: [] });
  });
});

describe("scoredPlayersResult", () => {
  it("records an individual win with every participant and score", () => {
    const result = scoredPlayersResult("mimica", [
      { ...rama, score: 4 },
      { ...lu, score: 2 },
      { ...third, score: 1 },
    ]);
    expect(result).toMatchObject({
      kind: "competitive",
      outcome: "win",
      winnerSeatIds: ["player-1"],
    });
    expect(result.participants.map((seat) => [seat.kind, seat.name, seat.score])).toEqual([
      ["character", "Rama", 4],
      ["guest", "Lu", 2],
      ["generic", "Jugador 3", 1],
    ]);
  });

  it("records a tie with everyone at the top", () => {
    const result = scoredPlayersResult("mimica", [
      { ...rama, score: 2 },
      { ...lu, score: 2 },
      { ...third, score: 0 },
    ]);
    expect(result.outcome).toBe("tie");
    expect(result.winnerSeatIds).toEqual(["player-1", "player-2"]);
  });
});

describe("scoredTeamsResult", () => {
  const teams = [
    { id: "team-1", name: "Equipo Violeta", seatIds: ["player-1", "player-3"], score: 5 },
    { id: "team-2", name: "Equipo Turquesa", seatIds: ["player-2", "player-4"], score: 3 },
  ];

  it("names the winning team and its members", () => {
    const result = scoredTeamsResult("charadas", teams, [rama, lu, third, fourth]);
    expect(result.outcome).toBe("win");
    expect(result.winnerTeamIds).toEqual(["team-1"]);
    expect(result.winnerSeatIds).toEqual(["player-1", "player-3"]);
    expect(result.participants.map((seat) => seat.teamId)).toEqual([
      "team-1",
      "team-2",
      "team-1",
      "team-2",
    ]);
  });

  it("records a team tie", () => {
    const tied = teams.map((team) => ({ ...team, score: 2 }));
    const result = scoredTeamsResult("charadas", tied, [rama, lu, third, fourth]);
    expect(result.outcome).toBe("tie");
    expect(result.winnerTeamIds).toEqual(["team-1", "team-2"]);
  });
});

describe("decidedResult", () => {
  it("keeps the winners the rules named, and ignores unknown seats", () => {
    const result = decidedResult("categorias-explosivas", [rama, lu], ["player-2", "player-9"]);
    expect(result).toMatchObject({ outcome: "win", winnerSeatIds: ["player-2"] });
  });

  it("has no winner when the rules named none", () => {
    expect(decidedResult("categorias-explosivas", [rama, lu], []).outcome).toBe("no-winner");
  });

  it("records sides such as the group against the infiltrator", () => {
    const result = decidedResult(
      "el-infiltrado",
      [rama, lu, third],
      ["player-1", "player-3"],
      [
        { id: "group", name: "Grupo", seatIds: ["player-1", "player-3"] },
        { id: "infiltrator", name: "Infiltrado", seatIds: ["player-2"] },
      ],
      ["group"],
    );
    expect(result.winnerTeamIds).toEqual(["group"]);
    expect(result.participants.find((seat) => seat.seatId === "player-2")?.teamId).toBe(
      "infiltrator",
    );
  });
});

describe("socialResult", () => {
  it("has no winner by design", () => {
    expect(socialResult("quien-es-mas-probable-que", [rama, third])).toMatchObject({
      kind: "social",
      outcome: "social",
      winnerSeatIds: [],
      winnerTeamIds: [],
    });
  });
});
