import { ArrowRight } from "lucide-react";

import { GameIllustration } from "@/components/brand/game-illustration";
import {
  CardAction,
  CardShell,
  CardTitleLink,
  GameFacts,
  GameStub,
} from "@/components/catalog/game-card-parts";
import { StatusIndicator } from "@/components/design/status-indicator";
import { CATEGORY_LABELS } from "@/content/labels";
import type { GameDefinition } from "@/types/game";

type GameCardProps = {
  game: GameDefinition;
  className?: string;
};

export function GameCard({ game, className }: GameCardProps) {
  return (
    <CardShell game={game} className={className}>
      <article className="arcade-edge flex h-full flex-col overflow-hidden rounded-arcade-card bg-card [--ticket-stub:10rem]">
        <GameStub game={game} className="h-(--ticket-stub)">
          <GameIllustration
            slug={game.slug}
            className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:scale-110 group-hover:-rotate-3"
          />
        </GameStub>

        <div className="flex flex-1 flex-col gap-3 border-t-2 border-arcade-edge p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {CATEGORY_LABELS[game.category]}
            </span>
            <StatusIndicator status={game.status} />
          </div>
          <h3 className="font-display text-4xl leading-[0.9]">
            <CardTitleLink game={game} />
          </h3>
          <p className="flex-1 text-muted-foreground">{game.description}</p>
          <GameFacts game={game} className="text-sm" />
          <CardAction game={game} className="mt-1 self-start" />
        </div>
      </article>
    </CardShell>
  );
}

/** A slim ticket: the phone catalog, and games the group cannot play yet. */
export function GameRowCard({ game, className }: GameCardProps) {
  return (
    <CardShell game={game} className={className}>
      <article className="arcade-edge flex h-full overflow-hidden rounded-arcade-card bg-card [--ticket-stub:6.5rem]">
        <GameStub game={game} className="w-(--ticket-stub) shrink-0 p-3">
          <GameIllustration slug={game.slug} className="h-auto w-full" />
        </GameStub>

        <div className="flex min-w-0 flex-1 flex-col gap-2 border-l-2 border-arcade-edge p-4">
          <h3 className="font-display text-3xl leading-[0.9]">
            <CardTitleLink game={game} />
          </h3>
          <span className="text-sm font-medium text-muted-foreground">
            {CATEGORY_LABELS[game.category]}
          </span>
          <GameFacts game={game} className="text-sm" />
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
            <StatusIndicator status={game.status} />
            <ArrowRight
              aria-hidden="true"
              className="size-5 text-muted-foreground transition-colors group-hover:text-foreground"
            />
          </div>
        </div>
      </article>
    </CardShell>
  );
}
