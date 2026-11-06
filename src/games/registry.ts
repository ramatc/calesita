import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import type { GameSlug } from "@/types/game";

/**
 * The single place to plug in a playable game: add its screen here and mark
 * its catalog entry as available. Each screen loads only when it is played.
 */
export const GAME_SCREENS: Partial<Record<GameSlug, ComponentType>> = {
  "actua-o-perdes": dynamic(() => import("@/games/actua-o-perdes/screen")),
  "categorias-explosivas": dynamic(() => import("@/games/categorias-explosivas/screen")),
  "desafio-relampago": dynamic(() => import("@/games/desafio-relampago/screen")),
  "el-infiltrado": dynamic(() => import("@/games/el-infiltrado/screen")),
  "quien-es-mas-probable-que": dynamic(
    () => import("@/games/quien-es-mas-probable-que/screen"),
  ),
};
