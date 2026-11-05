import { Clock, Users } from "lucide-react";
import Link from "next/link";

import { GameIllustration } from "@/components/brand/game-illustration";
import { CATEGORY_SURFACE } from "@/components/catalog/category-style";
import { Badge } from "@/components/ui/badge";
import {
  CATEGORY_LABELS,
  formatDuration,
  formatPlayers,
  STATUS_LABELS,
} from "@/content/labels";
import { cn } from "@/lib/utils";
import type { GameDefinition } from "@/types/game";

type GameCardProps = {
  game: GameDefinition;
  className?: string;
};

export function GameCard({ game, className }: GameCardProps) {
  return (
    <Link
      href={`/juegos/${game.slug}`}
      className={cn(
        "group block rounded-3xl transition-transform duration-200 ease-out hover:-translate-y-1 hover:-rotate-1 active:scale-[0.98]",
        className,
      )}
    >
      <article className="ticket flex h-full flex-col bg-card">
        <div
          className={cn(
            "flex h-(--ticket-stub) items-center justify-center p-4",
            CATEGORY_SURFACE[game.category],
          )}
        >
          <GameIllustration
            slug={game.slug}
            className="transition-transform duration-300 ease-out group-hover:scale-110"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 border-t-2 border-dashed border-background p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {CATEGORY_LABELS[game.category]}
            </span>
            <Badge variant={game.status === "available" ? "default" : "secondary"}>
              {STATUS_LABELS[game.status]}
            </Badge>
          </div>
          <h3 className="text-xl leading-tight font-bold">{game.name}</h3>
          <p className="flex-1 text-muted-foreground">{game.description}</p>
          <dl className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium" data-tabular>
            <div className="flex items-center gap-1.5">
              <dt>
                <Users aria-label="Jugadores" className="size-4" />
              </dt>
              <dd>{formatPlayers(game.players)}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt>
                <Clock aria-label="Duración" className="size-4" />
              </dt>
              <dd>{formatDuration(game.durationMinutes)}</dd>
            </div>
          </dl>
        </div>
      </article>
    </Link>
  );
}
