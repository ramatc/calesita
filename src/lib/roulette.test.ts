import { describe, expect, it } from "vitest";

import { drawIndex, getIndexAtPointer, planSpin } from "@/lib/roulette";

function sequence(values: number[]) {
  let call = 0;
  return (array: Uint32Array) => {
    array[0] = values[call++];
    return array;
  };
}

describe("drawIndex", () => {
  it("rejects values from the biased tail instead of folding them", () => {
    // 2^32 % 3 = 1, so 2^32 - 1 is the single rejected value.
    expect(drawIndex(3, sequence([2 ** 32 - 1, 4]))).toBe(1);
  });

  it("covers every index roughly equally", () => {
    const counts = [0, 0, 0, 0, 0];
    for (let run = 0; run < 20000; run += 1) counts[drawIndex(5)] += 1;
    counts.forEach((count) => expect(count).toBeGreaterThan(3600));
  });

  it("throws for an empty wheel", () => {
    expect(() => drawIndex(0)).toThrow(RangeError);
  });
});

describe("planSpin", () => {
  it("always stops with the drawn segment under the pointer", () => {
    for (let count = 1; count <= 20; count += 1) {
      for (let winner = 0; winner < count; winner += 1) {
        for (const offset of [0, 0.5, 0.999]) {
          for (const start of [0, 137.5, 1800 + 33]) {
            const rotation = planSpin(start, winner, count, offset);
            expect(rotation).toBeGreaterThan(start + 360 * 4);
            expect(getIndexAtPointer(rotation, count)).toBe(winner);
          }
        }
      }
    }
  });
});
