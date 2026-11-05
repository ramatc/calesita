"use client";

import { Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";

import { GameInstructions } from "@/components/game/game-instructions";
import { Button } from "@/components/ui/button";
import { usePersistentStore } from "@/hooks/use-persistent-store";
import { playerCountStore } from "@/lib/player-count";
import type { GameDefinition } from "@/types/game";

const DEFAULT_PLAYERS = 8;

type GameSetupProps = {
  game: GameDefinition;
  onStart: (players: number) => void;
  /** Game-specific options, shown between the player count and the start button. */
  children?: ReactNode;
};

export function GameSetup({ game, onStart, children }: GameSetupProps) {
  const stored = usePersistentStore(playerCountStore);
  const { min, max } = game.players;
  const players = Math.min(max, Math.max(min, stored ?? DEFAULT_PLAYERS));

  function start() {
    playerCountStore.set(players);
    onStart(players);
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 pb-4">
      <h1 className="font-display text-4xl leading-tight text-brand-yellow">{game.name}</h1>

      <GameInstructions rules={game.rules ?? []} />

      <div className="flex flex-col items-center gap-2">
        <span id="setup-players" className="font-semibold text-muted-foreground">
          ¿Cuántos juegan?
        </span>
        <div role="group" aria-labelledby="setup-players" className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="touch"
            aria-label="Un jugador menos"
            disabled={players === min}
            onClick={() => playerCountStore.set(players - 1)}
          >
            <Minus />
          </Button>
          <output aria-live="polite" data-tabular className="min-w-12 text-center text-4xl font-bold">
            {players}
          </output>
          <Button
            variant="secondary"
            size="touch"
            aria-label="Un jugador más"
            disabled={players === max}
            onClick={() => playerCountStore.set(players + 1)}
          >
            <Plus />
          </Button>
        </div>
      </div>

      {children}

      <Button variant="marquee" size="xl" className="mt-auto w-full" onClick={start}>
        Empezar
      </Button>
    </div>
  );
}
