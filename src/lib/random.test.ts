import { describe, expect, it } from "vitest";

import { pickRandom, shuffle } from "@/lib/random";

describe("pickRandom", () => {
  it("returns null for an empty list", () => {
    expect(pickRandom([])).toBeNull();
  });
});

describe("shuffle", () => {
  it("keeps every item exactly once and leaves the input untouched", () => {
    const items = [1, 2, 3, 4, 5];
    const result = shuffle(items);
    expect([...result].sort()).toEqual([1, 2, 3, 4, 5]);
    expect(items).toEqual([1, 2, 3, 4, 5]);
  });

  it("follows the random source", () => {
    expect(shuffle([1, 2, 3], () => 0)).toEqual([2, 3, 1]);
    expect(shuffle([1, 2, 3], () => 0.999)).toEqual([1, 2, 3]);
  });
});
