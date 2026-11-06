"use client";

import { useMemo } from "react";

import { usePersistentStore } from "@/hooks/use-persistent-store";
import { gameCastStore, getCastCharacters } from "@/lib/character-cast";

/** Looks up the characters of a running game by seat. Empty when nobody chose one. */
export function useGameCast(slug: string) {
  const casts = usePersistentStore(gameCastStore);

  return useMemo(() => {
    const cast = casts[slug] ?? {};
    return {
      forSeats: (seatIds: readonly string[]) => getCastCharacters(cast, seatIds),
      forSeat: (seatId: string) => getCastCharacters(cast, [seatId]).at(0),
    };
  }, [casts, slug]);
}
