"use client";

import { useSyncExternalStore } from "react";

import { FeaturedGameCard } from "@/components/catalog/featured-game-card";
import { GameCard } from "@/components/catalog/game-card";
import { FEATURED_GAMES, GAMES } from "@/content/catalog";
import { shuffle } from "@/lib/random";
import type { GameDefinition } from "@/types/game";

const FEATURED_COUNT = FEATURED_GAMES.length;

let pickedGames: readonly GameDefinition[] | null = null;

/** One draw per page load, so every render agrees and each visit shows a different five. */
function getPickedGames() {
  pickedGames ??= shuffle(GAMES.filter((game) => game.status === "available")).slice(
    0,
    FEATURED_COUNT,
  );
  return pickedGames;
}

const subscribe = () => () => {};

/** The server renders the curated five; the browser swaps in its own draw after hydration. */
export function FeaturedGames() {
  const [leadGame, ...otherGames] = useSyncExternalStore(
    subscribe,
    getPickedGames,
    () => FEATURED_GAMES,
  );

  return (
    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <FeaturedGameCard key={leadGame.slug} game={leadGame} className="reveal md:col-span-2" />
      <ul className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 py-2 [scrollbar-width:none] md:contents">
        {otherGames.map((game) => (
          <li key={game.slug} className="w-72 shrink-0 snap-start md:reveal md:w-auto">
            <GameCard game={game} className="h-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
