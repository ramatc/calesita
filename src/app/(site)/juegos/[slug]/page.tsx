import { ArrowLeft, Backpack, Clock, Gauge, Play, Users, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GameIllustration } from "@/components/brand/game-illustration";
import { CATEGORY_SURFACE } from "@/components/catalog/category-style";
import { GameInstructions } from "@/components/game/game-instructions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GAMES, getGameBySlug } from "@/content/catalog";
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  formatDuration,
  formatMaterials,
  formatPlayers,
  STATUS_LABELS,
} from "@/content/labels";
import { cn } from "@/lib/utils";

type GamePageProps = PageProps<"/juegos/[slug]">;

// Only catalog slugs exist, so unknown ones get a real 404 status.
export const dynamicParams = false;

export function generateStaticParams() {
  return GAMES.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const game = getGameBySlug((await params).slug);
  return game ? { title: game.name, description: game.description } : {};
}

type GameFactProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function GameFact({ icon: Icon, label, value }: GameFactProps) {
  return (
    <div className="rounded-2xl bg-card p-4">
      <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon aria-hidden="true" className="size-4" />
        {label}
      </dt>
      <dd className="mt-1 text-lg font-semibold" data-tabular>
        {value}
      </dd>
    </div>
  );
}

export default async function GamePage({ params }: GamePageProps) {
  const game = getGameBySlug((await params).slug);
  if (!game) notFound();

  return (
    <main className="mx-auto grid w-full max-w-5xl flex-1 gap-8 px-5 pt-4 pb-16 md:grid-cols-2 md:gap-12">
      <div className="md:col-span-2">
        <Button asChild variant="ghost" size="chip">
          <Link href="/juegos">
            <ArrowLeft />
            Todos los juegos
          </Link>
        </Button>
      </div>

      <div
        className={cn(
          "flex h-64 items-center justify-center rounded-3xl p-6 md:h-96",
          CATEGORY_SURFACE[game.category],
        )}
      >
        <GameIllustration slug={game.slug} />
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{CATEGORY_LABELS[game.category]}</Badge>
          <Badge variant={game.status === "available" ? "default" : "secondary"}>
            {STATUS_LABELS[game.status]}
          </Badge>
        </div>
        <h1 className="font-display text-4xl leading-tight text-brand-yellow md:text-5xl">
          {game.name}
        </h1>
        <p className="text-xl">{game.description}</p>

        <dl className="grid gap-3 sm:grid-cols-2">
          <GameFact icon={Users} label="Jugadores" value={formatPlayers(game.players)} />
          <GameFact icon={Clock} label="Duración" value={formatDuration(game.durationMinutes)} />
          <GameFact icon={Backpack} label="Materiales" value={formatMaterials(game.materials)} />
          <GameFact icon={Gauge} label="Dificultad" value={DIFFICULTY_LABELS[game.difficulty]} />
        </dl>

        {game.status === "available" ? (
          <Button asChild variant="marquee" size="xl" className="w-full">
            <Link href={`/jugar/${game.slug}`}>
              <Play />
              Jugar
            </Link>
          </Button>
        ) : (
          <p className="rounded-2xl bg-secondary p-4 font-medium">
            Este juego todavía no se puede jugar. Lo estamos terminando.
          </p>
        )}

        {game.rules && <GameInstructions rules={game.rules} />}
      </div>
    </main>
  );
}
