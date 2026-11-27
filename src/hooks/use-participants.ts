"use client";

import { useMemo } from "react";

import { usePersistentStore } from "@/hooks/use-persistent-store";
import { characterRosterStore } from "@/lib/character-cast";
import { guestsStore } from "@/lib/guests";
import { getParticipants } from "@/lib/participants";

/** Who is present tonight, readable from any screen. Empty is a normal state. */
export function useParticipants() {
  const roster = usePersistentStore(characterRosterStore);
  const guests = usePersistentStore(guestsStore);
  const participants = useMemo(() => getParticipants(roster, guests), [roster, guests]);
  return { roster, guests, participants };
}
