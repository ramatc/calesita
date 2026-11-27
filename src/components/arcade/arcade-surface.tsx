import type { ComponentProps, ElementType } from "react";

import { cn } from "@/lib/utils";

export type ArcadeTone = "light" | "sky" | "dark";

const TONES: Record<ArcadeTone, string> = {
  light: "surface-light",
  sky: "surface-sky",
  dark: "surface-dark",
};

type ArcadePanelProps<T extends ElementType> = {
  as?: T;
  tone: ArcadeTone;
  /** Adds the hard edge and flat shadow; off for full-bleed bands. */
  framed?: boolean;
} & Omit<ComponentProps<T>, "as">;

/**
 * A section-level surface. Its tone rebinds the semantic tokens for everything inside,
 * so light and dark areas can sit on one page without per-component overrides.
 */
export function ArcadePanel<T extends ElementType = "section">({
  as,
  tone,
  framed = true,
  className,
  ...props
}: ArcadePanelProps<T>) {
  const Component: ElementType = as ?? "section";

  return (
    <Component
      data-tone={tone}
      className={cn(TONES[tone], framed && "arcade-edge rounded-arcade-panel", className)}
      {...props}
    />
  );
}

type ArcadeCardProps = ComponentProps<"div"> & {
  /** Lifts and presses like a cabinet key; use only when the card holds a single action. */
  interactive?: boolean;
};

/** A raised card on the current surface: hard edge, flat shadow, 12px radius. */
export function ArcadeCard({ interactive = false, className, ...props }: ArcadeCardProps) {
  return (
    <div
      data-slot="arcade-card"
      className={cn(
        "arcade-edge rounded-arcade-card bg-arcade-raised p-4 text-arcade-text",
        interactive && "arcade-press focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-ring",
        className,
      )}
      {...props}
    />
  );
}
