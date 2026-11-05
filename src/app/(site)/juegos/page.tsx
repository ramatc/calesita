import type { Metadata } from "next";
import { Suspense } from "react";

import { GameCatalog, GameGrid } from "@/components/catalog/game-catalog";
import { GAMES } from "@/content/catalog";

export const metadata: Metadata = {
  title: "Juegos",
  description: "Todos los juegos de Calesita, por categoría, jugadores, duración y materiales.",
};

export default function CatalogPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 pt-6 pb-16">
      <h1 className="font-display text-5xl text-brand-yellow">Juegos</h1>
      <p className="mt-2 mb-8 text-lg text-muted-foreground">
        Decinos cuántos son y elegí el próximo.
      </p>
      <Suspense fallback={<GameGrid games={GAMES} />}>
        <GameCatalog />
      </Suspense>
    </main>
  );
}
