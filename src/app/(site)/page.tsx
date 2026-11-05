import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CarouselIllustration } from "@/components/brand/carousel-illustration";
import { GameIllustration } from "@/components/brand/game-illustration";
import { Logo } from "@/components/brand/logo";
import { CATEGORY_SURFACE } from "@/components/catalog/category-style";
import { SectionHeading } from "@/components/design/section-heading";
import { GameCard } from "@/components/catalog/game-card";
import { PlayerCountPicker } from "@/components/catalog/player-count-picker";
import { SurpriseButton } from "@/components/catalog/surprise-button";
import { Button } from "@/components/ui/button";
import { FEATURED_GAMES, GAMES } from "@/content/catalog";
import { CATEGORY_DESCRIPTIONS, CATEGORY_LABELS } from "@/content/labels";
import { buildCatalogQuery, CATEGORIES } from "@/games/catalog-query";
import { cn } from "@/lib/utils";
import type { GameCategory, GameSlug } from "@/types/game";

const CATEGORY_ILLUSTRATION: Record<GameCategory, GameSlug> = {
  classic: "categorias-explosivas",
  social: "el-infiltrado",
  physical: "desafio-relampago",
};

function categoryHref(category: GameCategory) {
  const query = buildCatalogQuery({ category, duration: null, material: null });
  return `/juegos?${query}`;
}

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 pt-6 pb-12 md:grid-cols-2 md:gap-12 md:pt-12">
        <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
          <div>
            <h1>
              <Logo className="text-7xl lg:text-8xl" />
            </h1>
            <p className="mt-4 text-2xl font-semibold md:text-3xl">
              La juntada sigue girando.
            </p>
          </div>
          <PlayerCountPicker />
          <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:items-start md:justify-start">
            <Button asChild variant="marquee" size="xl">
              <Link href="/juegos">Empezar a jugar</Link>
            </Button>
            <SurpriseButton />
          </div>
        </div>
        <CarouselIllustration className="mx-auto max-w-sm md:max-w-none" />
      </section>

      <div aria-hidden="true" className="bulb-line" />

      <section aria-labelledby="featured-heading" className="py-12">
        <SectionHeading
          id="featured-heading"
          title="Destacados"
          className="mx-auto w-full max-w-6xl px-5"
          action={
            <Button asChild variant="ghost" size="chip">
              <Link href="/juegos">
                Ver los {GAMES.length}
                <ArrowRight />
              </Link>
            </Button>
          }
        />
        <ul className="mt-6 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))] py-2">
          {FEATURED_GAMES.map((game) => (
            <li key={game.slug} className="w-72 shrink-0 snap-start">
              <GameCard game={game} className="h-full" />
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="categories-heading"
        className="mx-auto w-full max-w-6xl px-5 pb-16"
      >
        <SectionHeading id="categories-heading" title="Categorías" />
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {CATEGORIES.map((category) => (
            <li key={category}>
              <Link
                href={categoryHref(category)}
                className={cn(
                  "group flex h-full items-center justify-between gap-3 overflow-hidden rounded-3xl p-5 transition-transform duration-200 ease-out hover:-translate-y-1 active:scale-[0.98]",
                  CATEGORY_SURFACE[category],
                )}
              >
                <span>
                  <span className="block text-2xl font-bold">{CATEGORY_LABELS[category]}</span>
                  <span className="mt-1 block">{CATEGORY_DESCRIPTIONS[category]}</span>
                </span>
                <GameIllustration
                  slug={CATEGORY_ILLUSTRATION[category]}
                  className="h-20 shrink-0 transition-transform duration-300 ease-out group-hover:rotate-6"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
