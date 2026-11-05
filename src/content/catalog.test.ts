import { describe, expect, it } from "vitest";

import { FEATURED_GAMES, GAMES } from "@/content/catalog";

const NAMES_BY_CATEGORY = {
  classic: [
    "Actuá o perdés",
    "Palabras prohibidas",
    "Preguntados Calesita",
    "Dibujalo como puedas",
    "Categorías explosivas",
  ],
  social: [
    "El infiltrado",
    "¿Quién es más probable que...?",
    "Mentira o verdad",
    "Defendé lo indefendible",
    "Confesiones anónimas",
  ],
  physical: [
    "Desafío relámpago",
    "Búsqueda desesperada",
    "Estatuas imposibles",
    "Un minuto para ganar",
    "Olimpiadas Calesita",
  ],
};

describe("game catalog", () => {
  it("lists the 15 requested games in their categories", () => {
    for (const [category, names] of Object.entries(NAMES_BY_CATEGORY)) {
      expect(
        GAMES.filter((game) => game.category === category).map((game) => game.name),
      ).toEqual(names);
    }
    expect(GAMES).toHaveLength(15);
  });

  it("has unique slugs", () => {
    expect(new Set(GAMES.map((game) => game.slug)).size).toBe(GAMES.length);
  });

  it("has coherent ranges and a description for every game", () => {
    for (const game of GAMES) {
      expect(game.players.min).toBeLessThanOrEqual(game.players.max);
      expect(game.durationMinutes.min).toBeLessThanOrEqual(game.durationMinutes.max);
      expect(game.description.length).toBeGreaterThan(0);
    }
  });

  it("allows El infiltrado between 4 and 12 players", () => {
    const infiltrado = GAMES.find((game) => game.slug === "el-infiltrado");
    expect(infiltrado?.players).toEqual({ min: 4, max: 12 });
  });

  it("features the five MVP games", () => {
    expect(FEATURED_GAMES.map((game) => game.slug).sort()).toEqual(
      [
        "actua-o-perdes",
        "categorias-explosivas",
        "desafio-relampago",
        "el-infiltrado",
        "quien-es-mas-probable-que",
      ].sort(),
    );
  });
});
