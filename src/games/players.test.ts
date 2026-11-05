import { describe, expect, it } from "vitest";

import {
  addTeamPoint,
  createPlayers,
  createTeams,
  getLeaders,
  getNextActiveIndex,
  isPlayer,
  isTeam,
} from "@/games/players";

describe("createPlayers", () => {
  it("creates unique ids and default names", () => {
    const players = createPlayers(3);
    expect(players.map((player) => player.name)).toEqual(["Jugador 1", "Jugador 2", "Jugador 3"]);
    expect(new Set(players.map((player) => player.id)).size).toBe(3);
  });

  it("uses given names, trimmed, and defaults for the blanks", () => {
    const players = createPlayers(3, ["  Ana ", "", "Luz"]);
    expect(players.map((player) => player.name)).toEqual(["Ana", "Jugador 2", "Luz"]);
  });

  it("ignores names beyond the player count", () => {
    expect(createPlayers(1, ["Ana", "Luz"])).toHaveLength(1);
  });
});

describe("getNextActiveIndex", () => {
  it("moves to the next index and wraps around", () => {
    expect(getNextActiveIndex(0, [true, true, true])).toBe(1);
    expect(getNextActiveIndex(2, [true, true, true])).toBe(0);
  });

  it("skips inactive players", () => {
    expect(getNextActiveIndex(0, [true, false, true])).toBe(2);
    expect(getNextActiveIndex(2, [true, false, true])).toBe(0);
  });

  it("stays put when nobody else is active", () => {
    expect(getNextActiveIndex(1, [false, true, false])).toBe(1);
  });
});

describe("createTeams", () => {
  it("splits players evenly into two named teams at zero", () => {
    const players = createPlayers(5);
    const teams = createTeams(players);
    expect(teams).toHaveLength(2);
    expect(teams.map((team) => team.playerIds.length)).toEqual([3, 2]);
    expect(teams.every((team) => team.score === 0 && team.name.length > 0)).toBe(true);
    expect(new Set(teams.flatMap((team) => team.playerIds)).size).toBe(5);
  });

  it("accepts custom team names", () => {
    const teams = createTeams(createPlayers(4), ["Rojos", " "]);
    expect(teams[0].name).toBe("Rojos");
    expect(teams[1].name).toBe("Equipo Turquesa");
  });
});

describe("addTeamPoint", () => {
  it("adds a point to one team without mutating the input", () => {
    const teams = createTeams(createPlayers(4));
    const result = addTeamPoint(teams, teams[1].id);
    expect(result.map((team) => team.score)).toEqual([0, 1]);
    expect(teams[1].score).toBe(0);
  });
});

describe("getLeaders", () => {
  it("returns the highest score, including ties", () => {
    const a = { score: 3 };
    const b = { score: 5 };
    const c = { score: 5 };
    expect(getLeaders([a, b, c])).toEqual([b, c]);
  });

  it("returns nothing for an empty list", () => {
    expect(getLeaders([])).toEqual([]);
  });
});

describe("validators", () => {
  it("accept valid data and reject malformed data", () => {
    const players = createPlayers(2);
    expect(isPlayer(players[0])).toBe(true);
    expect(isPlayer({ id: 1, name: "Ana" })).toBe(false);
    expect(isTeam(createTeams(players)[0])).toBe(true);
    expect(isTeam({ id: "a", name: "b", playerIds: [], score: "1" })).toBe(false);
  });
});
