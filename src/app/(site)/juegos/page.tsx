import type { Metadata } from "next";
import { Suspense } from "react";

import { PixelLabel } from "@/components/arcade/pixel-type";
import { GameCatalog, GameGrid } from "@/components/catalog/game-catalog";
import { GAMES } from "@/content/catalog";

export const metadata: Metadata = {
  title: "Juegos",
  description: "Todos los juegos de Calesita, por categoría, jugadores, duración y materiales.",
};

export default function CatalogPage() {
  return (
    <main className="surface-light mt-6 flex-1 border-t-2 border-arcade-ink">
      <div className="mx-auto w-full max-w-6xl px-5 pt-10 pb-16">
        <PixelLabel accent>Select game</PixelLabel>
        <h1 className="mt-1 font-display text-6xl leading-[0.85] md:text-7xl">Juegos</h1>
        <p className="mt-3 mb-8 text-lg text-muted-foreground">
          Decinos cuántos son y elegí el próximo.
        </p>
        <Suspense fallback={<GameGrid games={GAMES} />}>
          <GameCatalog />
        </Suspense>
      </div>
    </main>
  );
}
