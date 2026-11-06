import { Heart } from "lucide-react";

import { Disclosure } from "@/components/design/disclosure";
import { Scoreboard } from "@/components/game/scoreboard";
import { SLUG, type Game } from "@/games/categorias-explosivas/logic";
import { useGameCast } from "@/hooks/use-game-cast";
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
  const { forSeats } = useGameCast(SLUG);
  const entries = game.players.map((player, index) => ({
    id: player.id,
    name: player.name,
    characters: forSeats([player.id]),
    value: <LivesHearts lives={player.lives} maxLives={game.maxLives} />,
    highlighted: index === game.currentIndex,
    dimmed: player.lives === 0,
  }));

  return (
    <Disclosure summary="Vidas de todos">
      <div className="max-h-56 overflow-y-auto">
        <Scoreboard label="Vidas de cada jugador" entries={entries} />
      </div>
    </Disclosure>
  );
}
