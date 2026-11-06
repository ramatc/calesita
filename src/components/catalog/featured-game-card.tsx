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
import { cn } from "@/lib/utils";
import type { GameDefinition } from "@/types/game";

type FeaturedGameCardProps = {
  game: GameDefinition;
  className?: string;
};

/** The headline ticket: its illustration lives outside the mask, so it can grow past the stub. */
export function FeaturedGameCard({ game, className }: FeaturedGameCardProps) {
  return (
    <CardShell game={game} className={className}>
      <article className="ticket flex h-full flex-col bg-card [--ticket-stub:13rem] md:ticket-side md:flex-row md:[--ticket-stub:40%]">
        <GameStub
          game={game}
          className="h-(--ticket-stub) shrink-0 md:h-auto md:w-(--ticket-stub)"
        />

        <div className="flex flex-1 flex-col gap-4 border-t-2 border-dashed border-background p-6 md:border-t-0 md:border-l-2 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-muted-foreground">
              {CATEGORY_LABELS[game.category]}
            </span>
            <StatusIndicator status={game.status} />
          </div>
          <h3 className="font-display text-4xl leading-none md:text-5xl">
            <CardTitleLink game={game} />
          </h3>
          <p className="flex-1 text-lg text-muted-foreground">{game.description}</p>
          <GameFacts game={game} />
          <CardAction game={game} size="xl" className="mt-2 self-start" />
        </div>
      </article>

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 -top-6 flex h-[calc(13rem+1.5rem)] justify-center md:right-auto md:bottom-0 md:h-auto md:w-[40%] md:items-center",
          game.status !== "available" && "opacity-70",
        )}
      >
        <GameIllustration
          slug={game.slug}
          className="h-full w-auto -rotate-6 drop-shadow-[0_12px_10px_rgb(26_14_48/35%)] transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-105 group-hover:-rotate-2 md:h-auto md:w-[150%] md:max-w-none md:shrink-0"
        />
      </div>
    </CardShell>
  );
}
