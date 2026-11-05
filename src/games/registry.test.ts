import { describe, expect, it } from "vitest";

import { GAMES } from "@/content/catalog";
import { GAME_SCREENS } from "@/games/registry";

describe("game registry", () => {
  it("has a screen for exactly the games marked as available", () => {
    const available = GAMES.filter((game) => game.status === "available").map((game) => game.slug);
    expect(Object.keys(GAME_SCREENS).sort()).toEqual([...available].sort());
  });

  it("gives every available game rules to show before playing", () => {
    for (const game of GAMES.filter((item) => item.status === "available")) {
      expect(game.rules?.length).toBeGreaterThan(0);
    }
  });
});
