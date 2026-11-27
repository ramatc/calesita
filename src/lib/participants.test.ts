import { beforeEach, describe, expect, it } from "vitest";

import { characterRosterStore } from "@/lib/character-cast";
import { addGuest, guestsStore, isGuest, removeGuest, renameGuest } from "@/lib/guests";
import {
  barra,
  getParticipants,
  getSyncedPlayerCount,
  toggleCharacter,
} from "@/lib/participants";
import { MAX_PLAYERS, playerCountStore } from "@/lib/player-count";

describe("getParticipants", () => {
  it("is empty with nobody present, which is a valid state", () => {
    expect(getParticipants([], [])).toEqual([]);
  });

  it("lists characters in roster order, then guests with default names", () => {
    const guests = addGuest(addGuest([], "Lu"));
    const people = getParticipants(["piku", "rama"], guests);
    expect(people.map((person) => [person.kind, person.name])).toEqual([
      ["character", "Piku"],
      ["character", "Rama"],
      ["guest", "Lu"],
      ["guest", "Invitado 2"],
    ]);
  });

  it("drops unknown character ids from stale storage", () => {
    expect(getParticipants(["nobody", "chino"], [])).toHaveLength(1);
  });
});

describe("toggleCharacter", () => {
  it("adds and removes without a seat limit", () => {
    expect(toggleCharacter(["rama"], "pili")).toEqual(["rama", "pili"]);
    expect(toggleCharacter(["rama", "pili"], "rama")).toEqual(["pili"]);
  });
});

describe("guests", () => {
  it("get unique ids, can be renamed and removed", () => {
    const two = addGuest(addGuest([]));
    expect(new Set(two.map((guest) => guest.id)).size).toBe(2);
    const renamed = renameGuest(two, two[1].id, "Sofi");
    expect(renamed[1].name).toBe("Sofi");
    expect(removeGuest(renamed, two[0].id)).toEqual([renamed[1]]);
    expect(addGuest(removeGuest(two, two[0].id)).map((g) => g.id)).toEqual(["guest-2", "guest-3"]);
  });

  it("rejects malformed stored guests", () => {
    expect(isGuest({ id: "guest-1", name: "" })).toBe(true);
    expect(isGuest({ id: "", name: "x" })).toBe(false);
    expect(isGuest({ name: "x" })).toBe(false);
  });
});

describe("player count sync", () => {
  it("follows the barra from two people and stays manual below", () => {
    expect(getSyncedPlayerCount(0, 6)).toBe(6);
    expect(getSyncedPlayerCount(1, null)).toBeNull();
    expect(getSyncedPlayerCount(3, 8)).toBe(3);
  });

  beforeEach(() => {
    characterRosterStore.set([]);
    guestsStore.set([]);
    playerCountStore.set(8);
  });

  it("updates the shared count as people join and leaves it when they all leave", () => {
    barra.toggleCharacter("rama");
    expect(playerCountStore.get()).toBe(8);
    barra.setGuests(addGuest([]));
    expect(playerCountStore.get()).toBe(2);
    barra.toggleCharacter("pili");
    expect(playerCountStore.get()).toBe(3);
    barra.clear();
    expect(playerCountStore.get()).toBe(3);
  });

  it("refuses a new participant beyond the maximum", () => {
    let guests = guestsStore.get();
    for (let index = 0; index < MAX_PLAYERS; index += 1) guests = addGuest(guests);
    barra.setGuests(guests);
    barra.toggleCharacter("rama");
    expect(characterRosterStore.get()).toEqual([]);
  });
});
