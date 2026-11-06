import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { HeroStage } from "@/components/brand/hero-stage";
import { SloganMarquee } from "@/components/brand/slogan-marquee";
import { CategoryCard } from "@/components/catalog/category-card";
import { CharacterLineup } from "@/components/characters/character-lineup";
import { FeaturedGameCard } from "@/components/catalog/featured-game-card";
import { SectionHeading } from "@/components/design/section-heading";
import { GameCard } from "@/components/catalog/game-card";
import { SurpriseButton } from "@/components/catalog/surprise-button";
import { Button } from "@/components/ui/button";
import { FEATURED_GAMES, GAMES } from "@/content/catalog";
import { CATEGORIES, groupByAvailability } from "@/games/catalog-query";

export default function HomePage() {
  const { available, comingSoon } = groupByAvailability(FEATURED_GAMES);
  const [leadGame, ...otherGames] = [...available, ...comingSoon];

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

      <section
        aria-labelledby="featured-heading"
        className="mx-auto w-full max-w-6xl px-5 pt-16 pb-20"
      >
        <SectionHeading
          id="featured-heading"
          title="Destacados"
          action={
            <Button asChild variant="ghost" size="chip">
              <Link href="/juegos">
                Ver los {GAMES.length}
                <ArrowRight />
              </Link>
            </Button>
          }
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeaturedGameCard game={leadGame} className="reveal md:col-span-2" />
          <ul className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 py-2 [scrollbar-width:none] md:contents">
            {otherGames.map((game) => (
              <li key={game.slug} className="w-72 shrink-0 snap-start md:reveal md:w-auto">
                <GameCard game={game} className="h-full" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="categorias"
        aria-labelledby="categories-heading"
        className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 pb-20"
      >
        <SectionHeading id="categories-heading" title="Categorías" />
        <ul className="mt-8 grid gap-5 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <li key={category} className="reveal">
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="cast-heading" className="mx-auto w-full max-w-6xl px-5 pb-20">
        <SectionHeading
          id="cast-heading"
          title="La barra"
          description="Elegí quién sos antes de jugar. Si no, entrás igual."
        />
        <div className="reveal mt-8">
          <CharacterLineup />
        </div>
      </section>
    </main>
  );
}
