import { getCharacterById, isCharacterAvailable } from "@/content/characters";
import { getSeatId } from "@/games/players";
import { getGuestLabel, guestsStore, isGuest, type Guest } from "@/lib/guests";
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

/** Seat id to the guest sitting there, with the label they had when the game started. */
export type GuestCast = Record<string, Guest>;

function isGuestCastRecord(value: unknown): value is Record<string, GuestCast> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every(
      (cast) =>
        typeof cast === "object" && cast !== null && Object.values(cast).every(isGuest),
    )
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

/** The guests of each game as it started, beside its character cast. */
export const gameGuestCastStore = createPersistentStore<Record<string, GuestCast>>({
  key: "calesita:game-guest-casts",
  version: 1,
  fallback: {},
  validate: isGuestCastRecord,
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

/** Moves a chosen character one seat earlier (-1) or later (1). Edges stay put. */
export function moveInRoster(
  roster: readonly string[],
  id: string,
  offset: -1 | 1,
  seats: number,
): string[] {
  const order = getEffectiveRoster(roster, seats);
  const from = order.indexOf(id);
  const to = from + offset;
  if (from < 0 || to < 0 || to >= order.length) return [...roster];
  [order[from], order[to]] = [order[to], order[from]];
  return [...order, ...roster.filter((item) => !order.includes(item))];
}

export function buildCast(roster: readonly string[], seats: number): Cast {
  return Object.fromEntries(
    getEffectiveRoster(roster, seats).map((id, index) => [getSeatId(index), id]),
  );
}

/** Guests take the seats right after the characters, while seats last. */
export function buildGuestCast(
  roster: readonly string[],
  guests: readonly Guest[],
  seats: number,
): GuestCast {
  const taken = getEffectiveRoster(roster, seats).length;
  return Object.fromEntries(
    guests
      .slice(0, Math.max(0, seats - taken))
      .map((guest, index) => [
        getSeatId(taken + index),
        { id: guest.id, name: getGuestLabel(guest, index) },
      ]),
  );
}

/** Names for createPlayers: a seat with a character or a guest takes its name. */
export function getCastNames(
  cast: Cast,
  names: readonly string[],
  seats: number,
  guestCast: GuestCast = {},
): string[] {
  return Array.from({ length: seats }, (_, index) => {
    const seatId = getSeatId(index);
    const character = getCharacterById(cast[seatId] ?? "");
    return character?.name ?? guestCast[seatId]?.name ?? names[index] ?? "";
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
  return getCastNames(
    gameCastStore.get()[slug] ?? {},
    names,
    seats,
    gameGuestCastStore.get()[slug] ?? {},
  );
}

/** Who sits in a seat: a character, a guest, or a generic player with a typed or default name. */
export type SeatIdentity = {
  seatId: string;
  name: string;
  kind: "character" | "guest" | "generic";
  /** The character or guest id; absent for generic players. */
  refId?: string;
};

export function getSeatIdentity(
  cast: Cast,
  guestCast: GuestCast,
  seatId: string,
  name: string,
): SeatIdentity {
  const character = getCharacterById(cast[seatId] ?? "");
  if (character) return { seatId, name: character.name, kind: "character", refId: character.id };
  const guest = guestCast[seatId];
  if (guest) return { seatId, name: guest.name, kind: "guest", refId: guest.id };
  return { seatId, name, kind: "generic" };
}

/** Seat identities of a game whose cast is locked. */
export function getGameSeatIdentities(
  slug: string,
  seats: readonly { id: string; name: string }[],
): SeatIdentity[] {
  const cast = gameCastStore.get()[slug] ?? {};
  const guestCast = gameGuestCastStore.get()[slug] ?? {};
  return seats.map((seat) => getSeatIdentity(cast, guestCast, seat.id, seat.name));
}

/** Fixes the cast of a game as it starts. */
export function lockGameCast(slug: string, seats: number) {
  const roster = characterRosterStore.get();
  gameCastStore.set({ ...gameCastStore.get(), [slug]: buildCast(roster, seats) });
  gameGuestCastStore.set({
    ...gameGuestCastStore.get(),
    [slug]: buildGuestCast(roster, guestsStore.get(), seats),
  });
}
