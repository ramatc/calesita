import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { GameSlug } from "@/types/game";

const INK = "var(--brand-ink)";
const LIGHT = "var(--foreground)";
const VIOLET = "var(--primary)";

const ILLUSTRATIONS: Record<GameSlug, ReactNode> = {
  "actua-o-perdes": (
    <>
      <path d="M46 26h68v34c0 24-15 38-34 38S46 84 46 60Z" fill={LIGHT} />
      <path d="M58 46c4-6 12-6 16 0M86 46c4-6 12-6 16 0" stroke={INK} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M60 62h40c0 12-9 22-20 22S60 74 60 62Z" fill={VIOLET} />
    </>
  ),
  "palabras-prohibidas": (
    <>
      <path d="M32 22h96a10 10 0 0 1 10 10v44a10 10 0 0 1-10 10H70L46 104V86H32a10 10 0 0 1-10-10V32a10 10 0 0 1 10-10Z" fill={LIGHT} />
      <path d="M44 42h72M44 62h48" stroke={VIOLET} strokeWidth="8" strokeLinecap="round" />
      <path d="M30 98 130 12" stroke={INK} strokeWidth="9" strokeLinecap="round" />
    </>
  ),
  "preguntados-calesita": (
    <>
      <circle cx="80" cy="60" r="44" fill={LIGHT} />
      <path d="M64 48c0-10 7-16 16-16s16 6 16 15c0 14-16 13-16 28" stroke={VIOLET} strokeWidth="10" strokeLinecap="round" fill="none" />
      <circle cx="80" cy="90" r="6" fill={INK} />
    </>
  ),
  "dibujalo-como-puedas": (
    <>
      <rect x="28" y="16" width="104" height="88" rx="10" fill={LIGHT} />
      <path d="M42 80c10-26 18-26 24-8s12 18 22-10" stroke={VIOLET} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="m96 74 34-40 12 10-34 40-16 6Z" fill={INK} />
    </>
  ),
  "categorias-explosivas": (
    <>
      <circle cx="72" cy="70" r="36" fill={INK} />
      <path d="M94 42c6-14 14-20 26-20" stroke={INK} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="m124 8 5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1Z" fill={LIGHT} />
      <circle cx="60" cy="58" r="7" fill={LIGHT} />
    </>
  ),
  "el-infiltrado": (
    <>
      <path d="M36 54h88v10H36Z" fill={INK} />
      <path d="M52 54c2-20 8-30 12-30 6 0 10 6 16 6s10-6 16-6c4 0 10 10 12 30Z" fill={INK} />
      <circle cx="62" cy="80" r="16" fill={LIGHT} stroke={INK} strokeWidth="6" />
      <circle cx="98" cy="80" r="16" fill={LIGHT} stroke={INK} strokeWidth="6" />
      <path d="M78 78h4" stroke={INK} strokeWidth="6" />
    </>
  ),
  "quien-es-mas-probable-que": (
    <>
      <circle cx="80" cy="34" r="20" fill={VIOLET} />
      <path d="M50 92c0-20 14-30 30-30s30 10 30 30Z" fill={VIOLET} />
      <path d="M12 46h26m-10-10 10 10-10 10M148 46h-26m10-10-10 10 10 10" stroke={INK} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  "mentira-o-verdad": (
    <>
      <rect x="24" y="26" width="56" height="74" rx="10" transform="rotate(-8 52 63)" fill={LIGHT} />
      <rect x="80" y="20" width="56" height="74" rx="10" transform="rotate(8 108 57)" fill={INK} />
      <path d="m38 62 10 12 20-24" stroke={VIOLET} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="m96 44 24 26m0-26-24 26" stroke={LIGHT} strokeWidth="8" strokeLinecap="round" />
    </>
  ),
  "defende-lo-indefendible": (
    <>
      <path d="M80 12 124 28v32c0 26-18 42-44 50-26-8-44-24-44-50V28Z" fill={LIGHT} />
      <path d="M80 26 112 38v22c0 18-12 30-32 37Z" fill={VIOLET} />
      <circle cx="80" cy="58" r="11" fill={INK} />
    </>
  ),
  "confesiones-anonimas": (
    <>
      <rect x="22" y="30" width="116" height="72" rx="10" fill={LIGHT} />
      <path d="m26 36 54 40 54-40" stroke={VIOLET} strokeWidth="7" strokeLinejoin="round" fill="none" />
      <path d="M80 62c-9-12-24-2-14 10l14 12 14-12c10-12-5-22-14-10Z" fill={INK} />
    </>
  ),
  "desafio-relampago": (
    <>
      <path d="M92 8 40 68h32l-12 44 56-64H82Z" fill={INK} />
      <path d="M82 28 58 58h26l-6 22 22-28H78Z" fill={LIGHT} />
    </>
  ),
  "busqueda-desesperada": (
    <>
      <circle cx="68" cy="52" r="34" fill={LIGHT} stroke={INK} strokeWidth="10" />
      <path d="m94 78 34 30" stroke={INK} strokeWidth="14" strokeLinecap="round" />
      <path d="M50 46c2-8 8-13 16-14" stroke={VIOLET} strokeWidth="7" strokeLinecap="round" fill="none" />
    </>
  ),
  "estatuas-imposibles": (
    <>
      <rect x="40" y="94" width="80" height="16" rx="4" fill={INK} />
      <circle cx="80" cy="22" r="11" fill={LIGHT} />
      <path d="M80 34v34m0 0-14 26m14-26 14 26M80 44 52 30m28 14 28 8" stroke={LIGHT} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  "un-minuto-para-ganar": (
    <>
      <rect x="70" y="6" width="20" height="12" rx="3" fill={INK} />
      <circle cx="80" cy="64" r="44" fill={LIGHT} stroke={INK} strokeWidth="8" />
      <path d="M80 64V36a28 28 0 0 1 24 42Z" fill={VIOLET} />
      <circle cx="80" cy="64" r="5" fill={INK} />
    </>
  ),
  "olimpiadas-calesita": (
    <>
      <path d="M58 8h16l6 24 6-24h16L90 46H70Z" fill={VIOLET} />
      <circle cx="80" cy="70" r="30" fill={LIGHT} stroke={INK} strokeWidth="7" />
      <path d="m80 54 5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1Z" fill={INK} />
    </>
  ),
};

type GameIllustrationProps = {
  slug: GameSlug;
  className?: string;
};

/** Decorative: the game name always sits next to it. */
export function GameIllustration({ slug, className }: GameIllustrationProps) {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true" className={cn("h-full", className)}>
      {ILLUSTRATIONS[slug]}
    </svg>
  );
}
