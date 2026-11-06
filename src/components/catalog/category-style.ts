import type { GameCategory } from "@/types/game";

/** Each category owns one accent, so a ticket can be read by color at a glance. */
export const CATEGORY_SURFACE: Record<GameCategory, string> = {
  classic: "bg-brand-yellow text-brand-ink",
  social: "bg-brand-pink text-brand-ink",
  physical: "bg-brand-teal text-brand-ink",
};

/** A printed texture per category: bulbs, chat rings, and track stripes. */
export const CATEGORY_MOTIF: Record<GameCategory, string> = {
  classic: "motif-bulbs",
  social: "motif-rings",
  physical: "motif-stripes",
};
