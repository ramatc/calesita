export type RandomSource = () => number;

export function pickRandom<T>(
  items: readonly T[],
  random: RandomSource = Math.random,
): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(random() * items.length)];
}

/** Fisher-Yates over a copy; the input is left untouched. */
export function shuffle<T>(
  items: readonly T[],
  random: RandomSource = Math.random,
): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}
