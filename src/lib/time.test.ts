import { describe, expect, it } from "vitest";

import { getRemainingSeconds } from "@/lib/time";

describe("getRemainingSeconds", () => {
  it("rounds up so the display reaches zero only at the deadline", () => {
    expect(getRemainingSeconds(10_000, 7_000)).toBe(3);
    expect(getRemainingSeconds(10_000, 7_001)).toBe(3);
    expect(getRemainingSeconds(10_000, 9_999)).toBe(1);
    expect(getRemainingSeconds(10_000, 10_000)).toBe(0);
  });

  it("never goes below zero", () => {
    expect(getRemainingSeconds(10_000, 20_000)).toBe(0);
  });
});
