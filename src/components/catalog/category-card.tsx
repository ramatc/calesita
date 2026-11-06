import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { GameIllustration } from "@/components/brand/game-illustration";
import { CATEGORY_MOTIF, CATEGORY_SURFACE } from "@/components/catalog/category-style";
import { GAMES } from "@/content/catalog";
import { CATEGORY_DESCRIPTIONS, CATEGORY_LABELS } from "@/content/labels";
import { buildCatalogQuery } from "@/games/catalog-query";
import { cn } from "@/lib/utils";
import type { GameCategory, GameSlug } from "@/types/game";

const CATEGORY_ART: Record<GameCategory, readonly [back: GameSlug, front: GameSlug]> = {
  classic: ["dibujalo-como-puedas", "categorias-explosivas"],
  social: ["mentira-o-verdad", "el-infiltrado"],
  physical: ["estatuas-imposibles", "desafio-relampago"],
};

type CategoryCardProps = {
  category: GameCategory;
};

export function CategoryCard({ category }: CategoryCardProps) {
  const [back, front] = CATEGORY_ART[category];
  const query = buildCatalogQuery({ category, duration: null, material: null });
  const gameCount = GAMES.filter((game) => game.category === category).length;

  return (
    <Link
      href={`/juegos?${query}`}
      className={cn(
        "group relative flex h-full min-h-88 flex-col md:min-h-64 lg:min-h-88 justify-end overflow-hidden rounded-3xl p-6 shadow-raised transition-transform duration-300 ease-(--ease-out-expo) hover:-translate-y-1.5 hover:rotate-1 active:scale-[0.98]",
        CATEGORY_SURFACE[category],
        CATEGORY_MOTIF[category],
      )}
    >
      <span aria-hidden="true" className="absolute -top-2 right-0 left-0 h-44">
        <GameIllustration
          slug={back}
          className="absolute top-2 right-24 h-32 w-auto -rotate-12 transition-transform duration-500 ease-(--ease-out-expo) group-hover:-translate-x-2 group-hover:-rotate-18"
        />
        <GameIllustration
          slug={front}
          className="absolute top-8 -right-3 h-40 w-auto rotate-6 transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-110 group-hover:rotate-12"
        />
      </span>

      <h3 className="relative font-display text-4xl leading-none">{CATEGORY_LABELS[category]}</h3>
      <p className="relative mt-2 text-lg font-medium">{CATEGORY_DESCRIPTIONS[category]}</p>
      <span className="relative mt-4 flex items-center gap-1.5 font-bold" data-tabular>
        Ver los {gameCount}
        <ArrowRight className="size-5 transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
