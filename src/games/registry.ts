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
  "estatuas-imposibles": dynamic(() => import("@/games/estatuas-imposibles/screen")),
  "el-infiltrado": dynamic(() => import("@/games/el-infiltrado/screen")),
  "palabras-prohibidas": dynamic(() => import("@/games/palabras-prohibidas/screen")),
  "quien-es-mas-probable-que": dynamic(
    () => import("@/games/quien-es-mas-probable-que/screen"),
  ),
  "un-minuto-para-ganar": dynamic(() => import("@/games/un-minuto-para-ganar/screen")),
  "defende-lo-indefendible": dynamic(() => import("@/games/defende-lo-indefendible/screen")),
  "mentira-o-verdad": dynamic(() => import("@/games/mentira-o-verdad/screen")),
  "dibujalo-como-puedas": dynamic(() => import("@/games/dibujalo-como-puedas/screen")),
  "busqueda-desesperada": dynamic(() => import("@/games/busqueda-desesperada/screen")),
  "confesiones-anonimas": dynamic(() => import("@/games/confesiones-anonimas/screen")),
  "olimpiadas-calesita": dynamic(() => import("@/games/olimpiadas-calesita/screen")),
  "preguntados-calesita": dynamic(() => import("@/games/preguntados-calesita/screen")),
};
