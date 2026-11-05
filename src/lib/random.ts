export type RandomSource = () => number;

export function pickRandom<T>(
  items: readonly T[],
  random: RandomSource = Math.random,
): T | null {
  if (items.length === 0) return null;
  return items[Math.floor(random() * items.length)];
}
