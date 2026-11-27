import { getAchievements } from "@/lib/hall-of-fame/achievements";
import { getCharacterStats, type normalizeHistory } from "@/lib/hall-of-fame/stats";
import { createPersistentStore } from "@/lib/storage";
import type { CharacterId } from "@/types/character";

/**
 * Which unlocked achievements were already celebrated. It is separate from the match
 * history and only stores keys; unlocking still comes from the Hall of Fame rules.
 *
 * `null` means the registry was never initialized. The first read then records every
 * achievement already unlocked as seen, without celebrating, so a first visit does not
 * replay the whole past.
 */
export type SeenAchievements = readonly string[] | null;

export function achievementKey(characterId: CharacterId, achievementId: string): string {
  return `${characterId}:${achievementId}`;
}

/** Every unlocked achievement in the history, as stable keys. */
export function getUnlockedKeys(
  history: ReturnType<typeof normalizeHistory>,
  characterIds: readonly CharacterId[],
): string[] {
  return characterIds.flatMap((characterId) =>
    getAchievements(getCharacterStats(history, characterId))
      .filter((achievement) => achievement.unlocked)
      .map((achievement) => achievementKey(characterId, achievement.id)),
  );
}

export type SeenDiff = {
  /** Achievements to celebrate now, in history order. */
  fresh: string[];
  /** The registry to store after this read. */
  next: string[];
};

export function diffSeenAchievements(unlocked: readonly string[], seen: SeenAchievements): SeenDiff {
  if (seen === null) return { fresh: [], next: [...new Set(unlocked)] };
  const known = new Set(seen);
  const fresh = [...new Set(unlocked.filter((key) => !known.has(key)))];
  return { fresh, next: [...seen, ...fresh] };
}

export function isSeenAchievements(value: unknown): value is SeenAchievements {
  return value === null || (Array.isArray(value) && value.every((key) => typeof key === "string"));
}

export const seenAchievementsStore = createPersistentStore<SeenAchievements>({
  key: "calesita:seen-achievements",
  version: 1,
  fallback: null,
  validate: isSeenAchievements,
});
