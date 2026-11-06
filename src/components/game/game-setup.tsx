"use client";

import { Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";

import { GameIllustration } from "@/components/brand/game-illustration";
import { GameStub } from "@/components/catalog/game-card-parts";
import { GameInstructions } from "@/components/game/game-instructions";
import { Button } from "@/components/ui/button";
import { usePersistentStore } from "@/hooks/use-persistent-store";
import { lockGameCast } from "@/lib/character-cast";
import { playerCountStore } from "@/lib/player-count";
import type { GameDefinition } from "@/types/game";

const DEFAULT_PLAYERS = 8;

type GameSetupProps = {
  game: GameDefinition;
  onStart: (players: number) => void;
  /** Game-specific options, shown between the player count and the start button. */
  children?: (players: number) => ReactNode;
};

export function GameSetup({ game, onStart, children }: GameSetupProps) {
  const stored = usePersistentStore(playerCountStore);
  const { min, max } = game.players;
  const players = Math.min(max, Math.max(min, stored ?? DEFAULT_PLAYERS));

  function start() {
    playerCountStore.set(players);
    lockGameCast(game.slug, players);
    onStart(players);
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="grid items-start gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <GameStub game={game} className="h-36 rounded-3xl shadow-raised">
            <GameIllustration slug={game.slug} />
          </GameStub>
          <h1 className="font-display text-4xl leading-none text-brand-yellow md:text-5xl">
            {game.name}
          </h1>
          <GameInstructions rules={game.rules ?? []} />
        </div>

        <section
          aria-label="Configuración de la partida"
          className="flex flex-col gap-5 rounded-3xl bg-card p-5 shadow-card"
        >
          <div className="flex items-center justify-between gap-4">
            <span id="setup-players" className="font-semibold text-muted-foreground">
              ¿Cuántos juegan?
            </span>
            <div role="group" aria-labelledby="setup-players" className="flex items-center gap-3">
          <Button
                variant="secondary"
                size="touch"
                aria-label="Un jugador menos"
                disabled={players === min}
                onClick={() => playerCountStore.set(players - 1)}
              >
                <Minus />
              </Button>
              <output
                aria-live="polite"
                data-tabular
                className="min-w-10 text-center font-display text-4xl"
              >
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

          {children?.(players)}
        </section>
      </div>

      <Button
        variant="marquee"
        size="xl"
        className="sticky bottom-3 z-10 mt-auto w-full"
        onClick={start}
      >
        Empezar
      </Button>
    </div>
  );
}
