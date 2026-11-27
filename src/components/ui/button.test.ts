import { describe, expect, it } from "vitest";

import { buttonVariants } from "@/components/ui/button";

const VARIANTS = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "marquee",
  "destructive",
  "link",
  "arcade",
  "arcade-orange",
  "arcade-outline",
  "arcade-ghost",
] as const;

describe("button focus indicator", () => {
  // Arcade variants paint a flat box-shadow, which hid a box-shadow focus ring.
  // An outline cannot collide with it, so every variant must keep one.
  it.each(VARIANTS)("%s shows an outline when focused from the keyboard", (variant) => {
    const classes = buttonVariants({ variant }).split(" ");
    expect(classes).toContain("focus-visible:outline-3");
    // outline-none leaves --tw-outline-style at none, so the style must be set again.
    expect(classes).toContain("focus-visible:outline-solid");
    expect(classes).toContain("focus-visible:outline-ring");
    expect(classes.some((name) => name.startsWith("focus-visible:ring"))).toBe(false);
  });
});
