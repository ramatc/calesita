import { ArrowRight, Clock, Play, Users } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { CATEGORY_MOTIF, CATEGORY_SURFACE } from "@/components/catalog/category-style";
import { Button } from "@/components/ui/button";
import { formatDuration, formatPlayers } from "@/content/labels";
import { cn } from "@/lib/utils";
import type { GameDefinition } from "@/types/game";

type GameProp = {
  game: GameDefinition;
  className?: string;
};

type WithChildren = GameProp & {
  children?: ReactNode;
};

/**
 * Sits outside the ticket mask, so its focus ring and shadow are not clipped by the notches.
 * Upcoming games stay reachable, but they do not lift like something ready to play.
 */
export function CardShell({ game, className, children }: WithChildren) {
  return (
    <div
      className={cn(
        "group relative rounded-arcade-card transition-transform duration-200 ease-(--ease-out-expo) has-[[data-card-link]:focus-visible]:outline-3 has-[[data-card-link]:focus-visible]:outline-offset-4 has-[[data-card-link]:focus-visible]:outline-ring",
        game.status === "available"
          ? "hover:-translate-y-0.5 has-[[data-card-link]:active]:translate-x-1 has-[[data-card-link]:active]:translate-y-1"
          : "opacity-90",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** The game name is the card's link: it stretches over the whole ticket. */
export function CardTitleLink({ game }: GameProp) {
  return (
    <Link
      href={`/juegos/${game.slug}`}
      data-card-link
      className="outline-none after:absolute after:inset-0 after:rounded-arcade-card after:content-['']"
    >
      {game.name}
    </Link>
  );
}

export function GameStub({ game, className, children }: WithChildren) {
  return (
    <div
      className={cn(
        "flex items-center justify-center p-4",
        CATEGORY_SURFACE[game.category],
        CATEGORY_MOTIF[game.category],
        game.status !== "available" && "grayscale-[0.85]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function GameFacts({ game, className }: GameProp) {
  return (
    <dl className={cn("flex flex-wrap gap-x-4 gap-y-1 font-medium", className)} data-tabular>
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
  );
}

type CardActionProps = GameProp & {
  size?: "chip" | "xl";
};

/** Playable games jump straight into setup; upcoming ones only point at their page. */
export function CardAction({ game, size = "chip", className }: CardActionProps) {
  if (game.status !== "available") {
    return (
      <span
        className={cn(
          "flex items-center gap-1.5 font-semibold text-muted-foreground transition-colors group-hover:text-foreground",
          className,
        )}
      >
        Ver detalle
        <ArrowRight className="size-4" />
      </span>
    );
  }

  return (
    <Button asChild variant="marquee" size={size} className={cn("relative z-10", className)}>
      <Link href={`/jugar/${game.slug}`} aria-label={`Jugar a ${game.name}`}>
        <Play className="fill-current transition-transform duration-200 group-hover/button:scale-110" />
        Jugar
      </Link>
    </Button>
  );
}
