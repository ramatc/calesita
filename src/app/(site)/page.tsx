import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { GameIllustration } from "@/components/brand/game-illustration";
import { HeroStage } from "@/components/brand/hero-stage";
import { SloganMarquee } from "@/components/brand/slogan-marquee";
import { CATEGORY_SURFACE } from "@/components/catalog/category-style";
import { SectionHeading } from "@/components/design/section-heading";
import { GameCard } from "@/components/catalog/game-card";
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
    <main className="flex-1 overflow-x-clip">
      <section
        aria-labelledby="hero-heading"
        className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 pt-8 pb-10 lg:grid-cols-[7fr_5fr] lg:gap-6 lg:pt-10 lg:pb-14"
      >
        <div className="flex flex-col gap-6">
          <h1
            id="hero-heading"
            className="font-display text-[clamp(2.5rem,11.6vw,5.5rem)] leading-[0.95] lg:text-[clamp(4rem,7.1vw,5.5rem)]"
          >
            <span className="block">Menos pantalla.</span>
            <span className="block text-brand-yellow">Más quilombo.</span>
          </h1>
          <p className="max-w-[36ch] text-lg text-muted-foreground md:text-xl">
            Party games para jugar en persona, con un solo celular. Sin registro y sin
            descargar nada.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <Button asChild variant="marquee" size="xl">
              <Link href="/juegos">Explorar juegos</Link>
            </Button>
            <SurpriseButton />
          </div>
        </div>
        <HeroStage />
      </section>

      <SloganMarquee />

      <section aria-labelledby="featured-heading" className="py-14">
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
        id="categorias"
        aria-labelledby="categories-heading"
        className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 pb-16"
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
