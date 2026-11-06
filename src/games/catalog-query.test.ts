import { describe, expect, it } from "vitest";

import {
  buildCatalogQuery,
  EMPTY_FILTERS,
  filterGames,
  groupByAvailability,
  getDurationBucket,
  parseCatalogParams,
  pickSurpriseGame,
} from "@/games/catalog-query";
import type { GameDefinition } from "@/types/game";

function game(overrides: Partial<GameDefinition>): GameDefinition {
  return {
    slug: "el-infiltrado",
    name: "Game",
    description: "Description",
    category: "social",
    players: { min: 4, max: 12 },
    durationMinutes: { min: 10, max: 20 },
    materials: [],
    difficulty: "easy",
    status: "available",
    ...overrides,
  };
}

const quick = game({ slug: "estatuas-imposibles", category: "physical" });
const paper = game({
  slug: "dibujalo-como-puedas",
  category: "classic",
  materials: ["paper"],
  durationMinutes: { min: 20, max: 30 },
  players: { min: 2, max: 6 },
});
const long = game({
  slug: "olimpiadas-calesita",
  category: "physical",
  materials: ["household-objects"],
  durationMinutes: { min: 30, max: 45 },
  status: "coming-soon",
});
const games = [quick, paper, long];

describe("filterGames", () => {
  it("returns every game without filters", () => {
    expect(filterGames(games, EMPTY_FILTERS)).toEqual(games);
  });

  it("filters by category", () => {
    expect(filterGames(games, { ...EMPTY_FILTERS, category: "physical" })).toEqual([quick, long]);
  });

  it("filters by players, including both range limits", () => {
    expect(filterGames(games, { ...EMPTY_FILTERS, players: 2 })).toEqual([paper]);
    expect(filterGames(games, { ...EMPTY_FILTERS, players: 4 })).toEqual(games);
    expect(filterGames(games, { ...EMPTY_FILTERS, players: 12 })).toEqual([quick, long]);
    expect(filterGames(games, { ...EMPTY_FILTERS, players: 13 })).toEqual([]);
  });

  it("filters by duration bucket", () => {
    expect(filterGames(games, { ...EMPTY_FILTERS, duration: "short" })).toEqual([quick]);
    expect(filterGames(games, { ...EMPTY_FILTERS, duration: "medium" })).toEqual([paper]);
    expect(filterGames(games, { ...EMPTY_FILTERS, duration: "long" })).toEqual([long]);
  });

  it("filters by material, where none means no materials needed", () => {
    expect(filterGames(games, { ...EMPTY_FILTERS, material: "none" })).toEqual([quick]);
    expect(filterGames(games, { ...EMPTY_FILTERS, material: "paper" })).toEqual([paper]);
    expect(filterGames(games, { ...EMPTY_FILTERS, material: "household-objects" })).toEqual([long]);
  });

  it("combines filters", () => {
    expect(
      filterGames(games, { ...EMPTY_FILTERS, category: "physical", material: "none" }),
    ).toEqual([quick]);
  });
});

describe("groupByAvailability", () => {
  it("splits games by status and keeps their order", () => {
    expect(groupByAvailability(games)).toEqual({
      available: [quick, paper],
      comingSoon: [long],
    });
  });
});

describe("getDurationBucket", () => {
  it("uses 20 and 30 minutes as bucket limits", () => {
    expect(getDurationBucket(game({ durationMinutes: { min: 5, max: 20 } }))).toBe("short");
    expect(getDurationBucket(game({ durationMinutes: { min: 5, max: 21 } }))).toBe("medium");
    expect(getDurationBucket(game({ durationMinutes: { min: 5, max: 30 } }))).toBe("medium");
    expect(getDurationBucket(game({ durationMinutes: { min: 5, max: 31 } }))).toBe("long");
  });
});

describe("pickSurpriseGame", () => {
  const firstItem = () => 0;
  const lastItem = () => 0.999;

  it("never picks a coming-soon game", () => {
    expect(pickSurpriseGame(games, null, lastItem)).toBe(paper);
    expect(pickSurpriseGame([long], null, firstItem)).toBeNull();
  });

  it("picks among games compatible with a known player count", () => {
    expect(pickSurpriseGame(games, 2, firstItem)).toBe(paper);
    expect(pickSurpriseGame(games, 12, lastItem)).toBe(quick);
  });

  it("returns null when no available game fits the player count", () => {
    expect(pickSurpriseGame(games, 20, firstItem)).toBeNull();
  });
});

describe("catalog URL params", () => {
  function params(query: string) {
    return new URLSearchParams(query);
  }

  it("reads valid values", () => {
    expect(
      parseCatalogParams(params("categoria=social&duracion=long&materiales=none")),
    ).toEqual({ category: "social", duration: "long", material: "none" });
  });

  it("ignores unknown values", () => {
    expect(
      parseCatalogParams(params("categoria=nada&duracion=7&materiales=fuego")),
    ).toEqual({ category: null, duration: null, material: null });
  });

  it("round-trips filters and omits empty ones", () => {
    const filters = { category: "classic", duration: null, material: "paper" } as const;
    expect(buildCatalogQuery(filters)).toBe("categoria=classic&materiales=paper");
    expect(parseCatalogParams(params(buildCatalogQuery(filters)))).toEqual(filters);
    expect(buildCatalogQuery({ category: null, duration: null, material: null })).toBe("");
  });
});
