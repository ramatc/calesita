import { getCharacterById, isCharacterAvailable } from "@/content/characters";
import { getSeatId } from "@/games/players";
import { createPersistentStore } from "@/lib/storage";
import type { Character } from "@/types/character";

/** Seat id to character id. Lives beside game state, which stays unaware of characters. */
export type Cast = Record<string, string>;

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every((item) => typeof item === "string")
  );
}

function isCastRecord(value: unknown): value is Record<string, Cast> {
  return (
    typeof value === "object" && value !== null && Object.values(value).every(isStringRecord)
  );
}

/** Who is playing tonight, in tap order. Empty is the normal case. */
export const characterRosterStore = createPersistentStore<string[]>({
  key: "calesita:character-roster",
  version: 1,
  fallback: [],
  validate: isStringList,
});

/** The cast each game started with, so editing the roster never rewrites a game in progress. */
export const gameCastStore = createPersistentStore<Record<string, Cast>>({
  key: "calesita:game-casts",
  version: 1,
  fallback: {},
  validate: isCastRecord,
});

export function getEffectiveRoster(roster: readonly string[], seats: number): string[] {
  return roster
    .filter((id) => {
      const character = getCharacterById(id);
      return character !== undefined && isCharacterAvailable(character);
    })
    .slice(0, seats);
}

export function toggleRoster(roster: readonly string[], id: string, seats: number): string[] {
  if (roster.includes(id)) return roster.filter((item) => item !== id);
  return getEffectiveRoster(roster, seats).length < seats ? [...roster, id] : [...roster];
}

export function buildCast(roster: readonly string[], seats: number): Cast {
  return Object.fromEntries(
    getEffectiveRoster(roster, seats).map((id, index) => [getSeatId(index), id]),
  );
}

/** Names for createPlayers: a seat with a character takes its name. */
export function getCastNames(cast: Cast, names: readonly string[], seats: number): string[] {
  return Array.from({ length: seats }, (_, index) => {
    const character = getCharacterById(cast[getSeatId(index)] ?? "");
    return character?.name ?? names[index] ?? "";
  });
}

export function getCastCharacters(cast: Cast, seatIds: readonly string[]): Character[] {
  return seatIds.flatMap((seatId) => {
    const character = getCharacterById(cast[seatId] ?? "");
    return character ? [character] : [];
  });
}

/** Names for a game whose cast is already locked. */
export function getGameNames(slug: string, names: readonly string[], seats: number): string[] {
  return getCastNames(gameCastStore.get()[slug] ?? {}, names, seats);
}

/** Fixes the cast of a game as it starts. */
export function lockGameCast(slug: string, seats: number) {
  const cast = buildCast(characterRosterStore.get(), seats);
  gameCastStore.set({ ...gameCastStore.get(), [slug]: cast });
}
