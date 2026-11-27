import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type CheckerBandProps = {
  /** Tile size, in rem. */
  size?: number;
  /** Fades the pattern toward its top edge so it reads as a floor, not a wall. */
  fade?: boolean;
  className?: string;
};

/**
 * A decorative checkerboard strip, colored by the current surface edge. It is hidden
 * from assistive tech and never receives pointer events, so it can sit under content.
 */
export function CheckerBand({ size = 1.5, fade = false, className }: CheckerBandProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "checker pointer-events-none h-12 [--checker-a:var(--arcade-edge)]",
        fade && "mask-t-from-10%",
        className,
      )}
      style={{ "--checker-size": `${size}rem` } as CSSProperties}
    />
  );
}
