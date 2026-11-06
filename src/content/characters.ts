import type { Character, CharacterExpression, CharacterView } from "@/types/character";

type CharacterSeed = Pick<Character, "id" | "name" | "colors" | "accessories">;

const SEEDS: readonly CharacterSeed[] = [
  {
    id: "rama",
    name: "Rama",
    colors: { primary: "#7B4DFF", secondary: "#FFD12F" },
    accessories: ["Arito en la ceja"],
  },
  {
    id: "aguysan",
    name: "Aguysan",
    colors: { primary: "#FF8A3D", secondary: "#FFF1D6" },
    accessories: [],
  },
  {
    id: "nehue",
    name: "Nehue",
    colors: { primary: "#6CC5F0", secondary: "#FFFFFF" },
    accessories: ["Mancuerna"],
  },
  {
    id: "pili",
    name: "Pili",
    colors: { primary: "#FF62AB", secondary: "#7A1F3D" },
    accessories: ["Anteojos", "Cerveza"],
  },
  {
    id: "piku",
    name: "Piku",
    colors: { primary: "#31D4C5", secondary: "#FFF0A8" },
    accessories: [],
  },
  {
    id: "chino",
    name: "Chino",
    colors: { primary: "#E5243B", secondary: "#FFFFFF" },
    accessories: ["Pelota de fútbol"],
  },
  {
    id: "agusmaxi",
    name: "Agusmaxi",
    colors: { primary: "#2B5FD9", secondary: "#FFFFFF" },
    accessories: ["Hamburguesa"],
  },
];

/** Art paths follow one convention; see public/characters/README.md to replace them. */
export const CHARACTERS: readonly Character[] = SEEDS.map((seed) => ({
  ...seed,
  art: {
    portrait: `/characters/${seed.id}/portrait.svg`,
    full: `/characters/${seed.id}/full.svg`,
  },
  availability: "available",
}));

export function getCharacterById(id: string): Character | undefined {
  return CHARACTERS.find((character) => character.id === id);
}

export function isCharacterAvailable(character: Character) {
  return character.availability === "available";
}

/** The art for a view and expression, or the base art of the view until that variant exists. */
export function getCharacterArt(
  { art }: Character,
  view: CharacterView = "portrait",
  expression: CharacterExpression = "neutral",
): string {
  return art.variants?.[`${view}-${expression}`] ?? art[view];
}
