import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  CHARACTERS,
  getCharacterArt,
  getCharacterById,
  isCharacterAvailable,
} from "@/content/characters";
import type { Character } from "@/types/character";

const publicPath = (path: string) => join(process.cwd(), "public", path);

describe("character catalog", () => {
  it("holds the seven friends, in order, with unique ids", () => {
    expect(CHARACTERS.map((character) => character.name)).toEqual([
      "Rama",
      "Aguysan",
      "Nehue",
      "Pili",
      "Piku",
      "Chino",
      "Agusmaxi",
    ]);
    expect(new Set(CHARACTERS.map((character) => character.id)).size).toBe(7);
  });

  it("gives every character the fields the system needs", () => {
    for (const character of CHARACTERS) {
      expect(character.colors.primary).toMatch(/^#[0-9A-F]{6}$/);
      expect(character.colors.secondary).toMatch(/^#[0-9A-F]{6}$/);
      expect(character.art.portrait).toMatch(/\.(svg|png)$/);
      expect(character.art.full).toMatch(/\.(svg|png)$/);
      expect(Array.isArray(character.accessories)).toBe(true);
      expect(["available", "coming-soon"]).toContain(character.availability);
    }
  });

  it("points at art files that exist", () => {
    for (const { art } of CHARACTERS) {
      expect(existsSync(publicPath(art.portrait))).toBe(true);
      expect(existsSync(publicPath(art.full))).toBe(true);
    }
  });

  it("never carries a height in app data", () => {
    expect(JSON.stringify(CHARACTERS)).not.toMatch(/height|altura|cm\b/i);
  });

  it("finds a character by id and rejects unknown ids", () => {
    expect(getCharacterById("pili")?.name).toBe("Pili");
    expect(getCharacterById("nobody")).toBeUndefined();
  });

  it("treats only available characters as selectable", () => {
    const rama = CHARACTERS[0];
    expect(isCharacterAvailable(rama)).toBe(true);
    expect(isCharacterAvailable({ ...rama, availability: "coming-soon" })).toBe(false);
  });
});

describe("getCharacterArt", () => {
  const character: Character = {
    ...CHARACTERS[0],
    art: {
      portrait: "/characters/test/portrait.svg",
      full: "/characters/test/full.svg",
      variants: { "portrait-celebrating": "/characters/test/portrait-celebrating.png" },
    },
  };

  it("defaults to the neutral portrait", () => {
    expect(getCharacterArt(character)).toBe("/characters/test/portrait.svg");
  });

  it("uses a variant when that art exists", () => {
    expect(getCharacterArt(character, "portrait", "celebrating")).toBe(
      "/characters/test/portrait-celebrating.png",
    );
  });

  it("falls back to the base art of the view when the variant is missing", () => {
    expect(getCharacterArt(character, "full", "celebrating")).toBe("/characters/test/full.svg");
  });
});
