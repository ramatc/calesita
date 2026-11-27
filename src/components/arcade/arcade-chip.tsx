import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type ArcadeChipProps = Omit<ComponentProps<"button">, "aria-pressed"> & {
  selected: boolean;
};

/**
 * A toggle key for filters and option groups. Selected keys sit pressed into their
 * shadow and turn yellow, so the state reads without relying on color alone.
 */
export function ArcadeChip({ selected, className, children, ...props }: ArcadeChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-arcade-control border-2 border-arcade-edge px-4 font-ui font-semibold select-none disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "translate-x-0.5 translate-y-0.5 bg-arcade-yellow text-arcade-ink shadow-arcade-sm"
          : "arcade-press bg-arcade-raised text-arcade-text shadow-arcade",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
