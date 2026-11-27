import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const SIZES = {
  display: "text-pixel-h1 sm:text-pixel-display",
  h1: "text-pixel-h2 sm:text-pixel-h1",
  h2: "text-pixel-h3 sm:text-pixel-h2",
  h3: "text-pixel-h3",
} as const;

type PixelHeadingProps = ComponentProps<"h2"> & {
  as?: "h1" | "h2" | "h3";
  size?: keyof typeof SIZES;
};

/** Jersey 10 headings. Display sizes only: never below 36px, never for running text. */
export function PixelHeading({ as: Tag = "h2", size = "h2", className, ...props }: PixelHeadingProps) {
  return <Tag className={cn("font-pixel text-balance", SIZES[size], className)} {...props} />;
}

type PixelLabelProps = ComponentProps<"span"> & {
  /** Paints the label in the surface accent (yellow on dark, violet on light). */
  accent?: boolean;
};

/**
 * Short decorative arcade labels: PLAYER SELECT, HIGH SCORES, GAME OVER.
 * Keep them to a few words; instructions and prompts always use Manrope.
 */
export function PixelLabel({ accent = false, className, ...props }: PixelLabelProps) {
  return (
    <span
      className={cn("pixel-label inline-block", accent && "text-(--arcade-accent)", className)}
      {...props}
    />
  );
}
