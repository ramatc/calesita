import { describe, expect, it } from "vitest";

import { CHARACTERS } from "@/content/characters";
import { createPlayers, createTeams } from "@/games/players";
import {
  buildCast,
  getCastCharacters,
  getCastNames,
  characterRosterStore,
  gameCastStore,
  getEffectiveRoster,
  getGameNames,
  lockGameCast,
  toggleRoster,
} from "@/lib/character-cast";

describe("toggleRoster", () => {
  it("adds in tap order, which sets the seat", () => {
    expect(toggleRoster(["rama"], "piku", 4)).toEqual(["rama", "piku"]);
  });

  it("removes a character already chosen and closes the gap", () => {
    expect(toggleRoster(["rama", "piku", "pili"], "piku", 4)).toEqual(["rama", "pili"]);
  });

  it("ignores a new character once every seat is taken", () => {
    expect(toggleRoster(["rama", "piku"], "pili", 2)).toEqual(["rama", "piku"]);
  });

  it("still removes when the roster is over the limit", () => {
    expect(toggleRoster(["rama", "piku", "pili"], "rama", 2)).toEqual(["piku", "pili"]);
  });
});

describe("getEffectiveRoster", () => {
  it("keeps only the seats in play and drops unknown ids", () => {
    expect(getEffectiveRoster(["ghost", "rama", "piku", "pili"], 2)).toEqual(["rama", "piku"]);
  });
});

describe("buildCast", () => {
  it("is empty when nobody chose a character", () => {
    expect(buildCast([], 8)).toEqual({});
  });

  it("assigns seats in roster order, using the ids of createPlayers", () => {
    const cast = buildCast(["rama", "piku"], 4);
    const players = createPlayers(4);

    expect(cast[players[0].id]).toBe("rama");
    expect(cast[players[1].id]).toBe("piku");
    expect(cast[players[2].id]).toBeUndefined();
  });

  it("drops characters beyond the seats in play", () => {
    expect(Object.keys(buildCast(["rama", "piku", "pili"], 2))).toHaveLength(2);
  });
});

describe("getCastNames", () => {
  it("leaves typed names untouched when nobody chose a character", () => {
    expect(getCastNames({}, ["Ana", "Beto"], 2)).toEqual(["Ana", "Beto"]);
  });

  it("names a seat after its character, over any typed name", () => {
    const cast = buildCast(["rama"], 3);
    expect(getCastNames(cast, ["Ana", "Beto"], 3)).toEqual(["Rama", "Beto", ""]);
  });

  it("feeds createPlayers without changing its default names", () => {
    const cast = buildCast(["piku"], 2);
    const players = createPlayers(2, getCastNames(cast, [], 2));
    expect(players.map((player) => player.name)).toEqual(["Piku", "Jugador 2"]);
  });
});

describe("getCastCharacters", () => {
  it("resolves the characters of a team without touching team data", () => {
    const players = createPlayers(4);
    const [teamOne, teamTwo] = createTeams(players);
    const cast = buildCast(["rama", "piku", "pili"], 4);

    expect(getCastCharacters(cast, teamOne.playerIds).map(({ id }) => id)).toEqual([
      "rama",
      "pili",
    ]);
    expect(getCastCharacters(cast, teamTwo.playerIds).map(({ id }) => id)).toEqual(["piku"]);
  });

  it("skips ids that no longer exist in the catalog", () => {
    expect(getCastCharacters({ "player-1": "ghost" }, ["player-1"])).toEqual([]);
  });
});

describe("lockGameCast", () => {
  it("keeps a running game on the cast it started with", () => {
    characterRosterStore.set(["rama"]);
    lockGameCast("some-game", 2);
    characterRosterStore.set(["piku"]);

    expect(gameCastStore.get()["some-game"]).toEqual({ "player-1": "rama" });
    expect(getGameNames("some-game", [], 2)).toEqual(["Rama", ""]);
  });

  it("clears the previous cast when a game starts with nobody chosen", () => {
    characterRosterStore.set([]);
    lockGameCast("some-game", 2);

    expect(gameCastStore.get()["some-game"]).toEqual({});
  });

  it("does not touch the cast of another game", () => {
    characterRosterStore.set(["rama"]);
    lockGameCast("first", 2);
    characterRosterStore.set(["piku"]);
    lockGameCast("second", 2);

    expect(gameCastStore.get().first).toEqual({ "player-1": "rama" });
  });
});

describe("the catalog supports every seat count of the cast", () => {
  it("can seat all seven", () => {
    const ids = CHARACTERS.map((character) => character.id);
    expect(Object.keys(buildCast(ids, 8))).toHaveLength(7);
  });
});
