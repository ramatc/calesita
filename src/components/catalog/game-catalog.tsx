"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { GameCard, GameRowCard } from "@/components/catalog/game-card";
import { GameFilters } from "@/components/catalog/game-filters";
import { Button } from "@/components/ui/button";
import { GAMES } from "@/content/catalog";
import {
  buildCatalogQuery,
  filterGames,
  groupByAvailability,
  parseCatalogParams,
  type CatalogParams,
} from "@/games/catalog-query";
import { usePersistentStore } from "@/hooks/use-persistent-store";
import { playerCountStore } from "@/lib/player-count";
import type { GameDefinition } from "@/types/game";

const NO_PARAMS: CatalogParams = { category: null, duration: null, material: null };

export function GameGrid({ games }: { games: readonly GameDefinition[] }) {
  const { available, comingSoon } = groupByAvailability(games);

  return (
    <div className="flex flex-col gap-12">
      {available.length > 0 && (
        <section aria-labelledby="available-games-heading" className="flex flex-col gap-5">
          <h2 id="available-games-heading" className="font-display text-3xl">
            Para jugar ahora
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {available.map((game) => (
              <li key={game.slug}>
                <GameCard game={game} className="h-full" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {comingSoon.length > 0 && (
        <section aria-labelledby="upcoming-games-heading" className="flex flex-col gap-5">
          <h2 id="upcoming-games-heading" className="font-display text-3xl">
            Próximamente
          </h2>
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {comingSoon.map((game) => (
              <li key={game.slug}>
                <GameRowCard game={game} className="h-full" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export function GameCatalog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const players = usePersistentStore(playerCountStore);

  const params = parseCatalogParams(searchParams);
  const games = filterGames(GAMES, { ...params, players });

  function updateParams(next: CatalogParams) {
    const query = buildCatalogQuery(next);
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function clearFilters() {
    updateParams(NO_PARAMS);
    playerCountStore.set(null);
  }

  return (
    <div className="flex flex-col gap-8">
      <GameFilters filters={params} onChange={updateParams} />

      <p role="status" className="font-medium text-muted-foreground" data-tabular>
        {games.length === 1 ? "1 juego" : `${games.length} juegos`}
      </p>

      {games.length > 0 ? (
        <GameGrid games={games} />
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-12 text-center">
          <h2 className="font-display text-3xl text-brand-yellow">No hay ningún juego así</h2>
          <p className="text-muted-foreground">
            Probá con menos filtros o con otra cantidad de jugadores.
          </p>
          <Button size="xl" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
