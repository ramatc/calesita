import { createPersistentStore } from "@/lib/storage";

/** Someone at the table without an illustrated character. */
export type Guest = {
  id: string;
  /** Empty means unnamed; the UI shows a numbered default. */
  name: string;
};

export const MAX_GUEST_NAME_LENGTH = 20;

export function isGuest(value: unknown): value is Guest {
  if (typeof value !== "object" || value === null) return false;
  const guest = value as Partial<Guest>;
  return typeof guest.id === "string" && guest.id.length > 0 && typeof guest.name === "string";
}

function isGuestList(value: unknown): value is Guest[] {
  return Array.isArray(value) && value.every(isGuest);
}

export const guestsStore = createPersistentStore<Guest[]>({
  key: "calesita:guests",
  version: 1,
  fallback: [],
  validate: isGuestList,
});

function createGuestId(existing: readonly Guest[]): string {
  let index = existing.length + 1;
  while (existing.some((guest) => guest.id === `guest-${index}`)) index += 1;
  return `guest-${index}`;
}

export function addGuest(guests: readonly Guest[], name = ""): Guest[] {
  return [
    ...guests,
    { id: createGuestId(guests), name: name.trim().slice(0, MAX_GUEST_NAME_LENGTH) },
  ];
}

export function renameGuest(guests: readonly Guest[], id: string, name: string): Guest[] {
  return guests.map((guest) =>
    guest.id === id ? { ...guest, name: name.slice(0, MAX_GUEST_NAME_LENGTH) } : guest,
  );
}

export function removeGuest(guests: readonly Guest[], id: string): Guest[] {
  return guests.filter((guest) => guest.id !== id);
}

/** The name to show: what they typed, or "Invitado N" by position. */
export function getGuestLabel(guest: Guest, index: number): string {
  return guest.name.trim() || `Invitado ${index + 1}`;
}
