import { pickRandom, type RandomSource } from "@/lib/random";
import type { GameCategory, GameDefinition, GameMaterial } from "@/types/game";

export const CATEGORIES = ["classic", "social", "physical"] as const;
export const DURATION_BUCKETS = ["short", "medium", "long"] as const;
export const MATERIAL_FILTERS = ["none", "paper", "household-objects"] as const;

export type DurationBucket = (typeof DURATION_BUCKETS)[number];
export type MaterialFilter = (typeof MATERIAL_FILTERS)[number];

/** Filters that live in the URL, so a filtered catalog can be linked and revisited. */
export type CatalogParams = {
  category: GameCategory | null;
  duration: DurationBucket | null;
  material: MaterialFilter | null;
};

export type CatalogFilters = CatalogParams & {
  players: number | null;
};

export const EMPTY_FILTERS: CatalogFilters = {
  category: null,
  duration: null,
  material: null,
  players: null,
};

const SHORT_LIMIT_MINUTES = 20;
const MEDIUM_LIMIT_MINUTES = 30;

const PARAM_NAMES = {
  category: "categoria",
  duration: "duracion",
  material: "materiales",
} as const;

export function getDurationBucket(game: GameDefinition): DurationBucket {
  if (game.durationMinutes.max <= SHORT_LIMIT_MINUTES) return "short";
  if (game.durationMinutes.max <= MEDIUM_LIMIT_MINUTES) return "medium";
  return "long";
}

function fitsPlayers(game: GameDefinition, players: number) {
  return players >= game.players.min && players <= game.players.max;
}

function usesMaterial(game: GameDefinition, material: MaterialFilter) {
  return material === "none"
    ? game.materials.length === 0
    : game.materials.includes(material as GameMaterial);
}

export function filterGames(
  games: readonly GameDefinition[],
  { category, duration, material, players }: CatalogFilters,
): GameDefinition[] {
  return games.filter(
    (game) =>
      (category === null || game.category === category) &&
      (duration === null || getDurationBucket(game) === duration) &&
      (material === null || usesMaterial(game, material)) &&
      (players === null || fitsPlayers(game, players)),
  );
}

export function pickSurpriseGame(
  games: readonly GameDefinition[],
  players: number | null,
  random?: RandomSource,
): GameDefinition | null {
  const candidates = games.filter(
    (game) =>
      game.status === "available" &&
      (players === null || fitsPlayers(game, players)),
  );
  return pickRandom(candidates, random);
}

function parseOption<T extends string>(
  value: string | null,
  options: readonly T[],
): T | null {
  return options.find((option) => option === value) ?? null;
}

export function parseCatalogParams(params: {
  get: (name: string) => string | null;
}): CatalogParams {
  return {
    category: parseOption(params.get(PARAM_NAMES.category), CATEGORIES),
    duration: parseOption(params.get(PARAM_NAMES.duration), DURATION_BUCKETS),
    material: parseOption(params.get(PARAM_NAMES.material), MATERIAL_FILTERS),
  };
}

export function buildCatalogQuery(filters: CatalogParams): string {
  const params = new URLSearchParams();
  if (filters.category) params.set(PARAM_NAMES.category, filters.category);
  if (filters.duration) params.set(PARAM_NAMES.duration, filters.duration);
  if (filters.material) params.set(PARAM_NAMES.material, filters.material);
  return params.toString();
}
