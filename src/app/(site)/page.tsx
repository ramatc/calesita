import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { AliveSlot } from "@/components/alive/alive-slot";
import { ArcadePanel } from "@/components/arcade/arcade-surface";
import { CheckerBand } from "@/components/arcade/checker-band";
import { PixelLabel } from "@/components/arcade/pixel-type";
import { HeroStage } from "@/components/brand/hero-stage";
import { SloganMarquee } from "@/components/brand/slogan-marquee";
import { CategoryCard } from "@/components/catalog/category-card";
import { LaBarra } from "@/components/barra/la-barra";
import { FeaturedGames } from "@/components/catalog/featured-games";
import { SectionHeading } from "@/components/design/section-heading";
import { SurpriseButton } from "@/components/catalog/surprise-button";
import { Button } from "@/components/ui/button";
import { GAMES } from "@/content/catalog";
import { CATEGORIES } from "@/games/catalog-query";

export default function HomePage() {
  return (
    <main className="flex-1 overflow-x-clip">
      <div className="mx-auto w-full max-w-6xl px-3 pt-6 pb-10 sm:px-5 lg:pt-8">
        <ArcadePanel tone="dark" aria-labelledby="hero-heading" className="relative overflow-hidden">
          <div className="relative z-10 grid items-end gap-6 px-5 pt-8 sm:px-8 lg:grid-cols-[7fr_5fr] lg:gap-4 lg:px-12 lg:pt-12">
            <div className="flex flex-col gap-5 lg:pb-14">
              <PixelLabel accent>Insert coin · 2 o más jugadores</PixelLabel>
              <h1
                id="hero-heading"
                className="font-display text-[clamp(3.5rem,16vw,6.5rem)] leading-[0.82] lg:text-[clamp(5rem,8.4vw,7rem)]"
              >
                <span className="block">Menos pantalla.</span>
                <span className="block text-arcade-yellow">Más quilombo.</span>
              </h1>
              <p className="max-w-[38ch] text-lg text-muted-foreground md:text-xl">
                Party games para jugar en persona, con un solo celular. Sin registro y sin
                descargar nada.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <Button asChild variant="marquee" size="xl">
                  <Link href="/juegos">Explorar juegos</Link>
                </Button>
                <SurpriseButton />
              </div>
            </div>
            <HeroStage />
          </div>
          <CheckerBand fade className="absolute inset-x-0 bottom-0 h-16 opacity-80" />
          <AliveSlot
            slot="home-hero"
            context="welcome"
            media="(min-width: 1024px)"
            className="absolute top-8 right-8 z-20"
          />
        </ArcadePanel>
      </div>

      <SloganMarquee />

      <section aria-labelledby="featured-heading" className="surface-light">
        <div className="mx-auto w-full max-w-6xl px-5 pt-16 pb-20">
          <SectionHeading
            id="featured-heading"
            eyebrow="Select game"
            title="Destacados"
            action={
              <Button asChild variant="arcade-ghost" size="chip">
                <Link href="/juegos">
                  Ver los {GAMES.length}
                  <ArrowRight />
                </Link>
              </Button>
            }
          />
          <FeaturedGames />
        </div>
      </section>

      <section
        id="categorias"
        aria-labelledby="categories-heading"
        className="surface-sky scroll-mt-24 border-y-2 border-arcade-ink"
      >
        <div className="mx-auto w-full max-w-6xl px-5 pt-16 pb-20">
          <SectionHeading id="categories-heading" eyebrow="Choose mode" title="Categorías" />
          <ul className="mt-8 grid gap-6 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <li key={category} className="reveal">
                <CategoryCard category={category} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="cast-heading" className="mx-auto w-full max-w-6xl px-5 pt-16 pb-20">
        <SectionHeading
          id="cast-heading"
          eyebrow="Player select"
          title="La barra"
          description="Marcá quién está esta noche y sumá invitados. Si no, entran igual."
        />
        <div className="reveal mt-8">
          <LaBarra />
        </div>
      </section>
    </main>
  );
}
