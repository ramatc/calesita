import { getCharacterById, isCharacterAvailable } from "@/content/characters";
import { characterRosterStore } from "@/lib/character-cast";
import { getGuestLabel, guestsStore, type Guest } from "@/lib/guests";
import { MAX_PLAYERS, MIN_PLAYERS, playerCountStore } from "@/lib/player-count";
import type { Character } from "@/types/character";

/**
 * Everyone present tonight. Characters come from the shared roster (the same one game
 * setups use), guests from their own store; this module only joins them.
 */
export type Participant =
  | { kind: "character"; id: string; name: string; character: Character }
  | { kind: "guest"; id: string; name: string };

export function getParticipants(
  roster: readonly string[],
  guests: readonly Guest[],
): Participant[] {
  const characters = roster.flatMap((id): Participant[] => {
    const character = getCharacterById(id);
    return character && isCharacterAvailable(character)
      ? [{ kind: "character", id: character.id, name: character.name, character }]
      : [];
  });
  const people = guests.map(
    (guest, index): Participant => ({
      kind: "guest",
      id: guest.id,
      name: getGuestLabel(guest, index),
    }),
  );
  return [...characters, ...people];
}

/** Presence on La barra has no seat limit; games cap it to their own count. */
export function toggleCharacter(roster: readonly string[], id: string): string[] {
  return roster.includes(id) ? roster.filter((item) => item !== id) : [...roster, id];
}

export function canAddParticipant(total: number): boolean {
  return total < MAX_PLAYERS;
}

/**
 * Sync rule: with two or more present, the player count follows the barra.
 * With fewer, the count is left as it was, so it keeps working as a manual picker.
 * The picker stays editable either way, for people not on the barra.
 */
export function getSyncedPlayerCount(total: number, current: number | null): number | null {
  return total >= MIN_PLAYERS ? Math.min(total, MAX_PLAYERS) : current;
}

function syncPlayerCount() {
  const total = getParticipants(characterRosterStore.get(), guestsStore.get()).length;
  const next = getSyncedPlayerCount(total, playerCountStore.get());
  if (next !== playerCountStore.get()) playerCountStore.set(next);
}

/** Mutations used by La barra; each one keeps the player count in sync. */
export const barra = {
  toggleCharacter(id: string) {
    const roster = characterRosterStore.get();
    const total = getParticipants(roster, guestsStore.get()).length;
    if (!roster.includes(id) && !canAddParticipant(total)) return;
    characterRosterStore.set(toggleCharacter(roster, id));
    syncPlayerCount();
  },
  setGuests(guests: Guest[]) {
    guestsStore.set(guests);
    syncPlayerCount();
  },
  clear() {
    characterRosterStore.set([]);
    guestsStore.set([]);
  },
};
