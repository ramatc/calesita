"use client";

import { Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePersistentStore } from "@/hooks/use-persistent-store";
import { MAX_PLAYERS, MIN_PLAYERS, playerCountStore } from "@/lib/player-count";

const DEFAULT_PLAYERS = 8;

export function PlayerCountPicker() {
  const players = usePersistentStore(playerCountStore);
  const shown = players ?? DEFAULT_PLAYERS;

  function change(delta: number) {
    if (players === null) {
      playerCountStore.set(DEFAULT_PLAYERS);
      return;
    }
    playerCountStore.set(Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, players + delta)));
  }

  return (
    <div role="group" aria-label="Cantidad de jugadores" className="flex flex-wrap items-center gap-2">
      <Button
        variant="secondary"
        size="touch"
        aria-label="Un jugador menos"
        disabled={players === MIN_PLAYERS}
        onClick={() => change(-1)}
      >
        <Minus />
      </Button>
      <output
        aria-live="polite"
        data-tabular
        className="min-w-32 text-center text-lg font-semibold"
      >
        {players === null ? "¿Cuántos son?" : `${shown} jugadores`}
      </output>
      <Button
        variant="secondary"
        size="touch"
        aria-label="Un jugador más"
        disabled={players === MAX_PLAYERS}
        onClick={() => change(1)}
      >
        <Plus />
      </Button>
      {players !== null && (
        <Button
          variant="ghost"
          size="touch"
          aria-label="Quitar cantidad de jugadores"
          onClick={() => playerCountStore.set(null)}
        >
          <X />
        </Button>
      )}
    </div>
  );
}
