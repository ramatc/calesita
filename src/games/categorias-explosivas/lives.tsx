import { ChevronDown, Heart } from "lucide-react";

import { Scoreboard } from "@/components/game/scoreboard";
import type { Game } from "@/games/categorias-explosivas/logic";
import { cn } from "@/lib/utils";

export function formatLives(lives: number) {
  if (lives === 0) return "sin vidas";
  return lives === 1 ? "1 vida" : `${lives} vidas`;
}

type LivesHeartsProps = {
  lives: number;
  maxLives: number;
};

export function LivesHearts({ lives, maxLives }: LivesHeartsProps) {
  return (
    <span role="img" aria-label={formatLives(lives)} className="inline-flex gap-0.5 align-middle">
      {Array.from({ length: maxLives }, (_, index) => (
        <Heart
          key={index}
          aria-hidden
          className={cn("size-5", index < lives ? "fill-current" : "opacity-30")}
        />
      ))}
    </span>
  );
}

/** Collapsed under the main action, so a long list never pushes it off the screen. */
export function LivesBoard({ game }: { game: Game }) {
  const entries = game.players.map((player, index) => ({
    id: player.id,
    name: player.name,
    value: <LivesHearts lives={player.lives} maxLives={game.maxLives} />,
    highlighted: index === game.currentIndex,
    dimmed: player.lives === 0,
  }));

  return (
    <details className="group">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center gap-2 font-semibold [&::-webkit-details-marker]:hidden">
        Vidas de todos
        <ChevronDown aria-hidden className="size-5 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-2 max-h-56 overflow-y-auto">
        <Scoreboard label="Vidas de cada jugador" entries={entries} />
      </div>
    </details>
  );
}
