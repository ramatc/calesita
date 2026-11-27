import { CHARACTERS } from "@/content/characters";
import type { MatchResult } from "@/lib/match-history";
import { getAllCharacterStats, normalizeHistory, type CharacterStats } from "@/lib/hall-of-fame/stats";

/**
 * Rankings order the seven characters by one criterion. Ties fall to more eligible
 * matches, then more wins, then the name, so the order is always the same.
 * There is no global score: each criterion is a real count or ratio.
 */

export const RANKING_CRITERIA = ["wins", "win-rate", "played"] as const;
export type RankingCriterion = (typeof RANKING_CRITERIA)[number];

export const RANKING_CRITERION_LABELS: Record<RankingCriterion, string> = {
  wins: "Más victorias",
  "win-rate": "Mejor porcentaje",
  played: "Más participaciones",
};

/** Eligible competitive matches needed before a win rate is ranked. */
export const MIN_RANKED_MATCHES = 5;

export type RankingEntry = {
  stats: CharacterStats;
  /** 1-based; null when the character has too few matches for this criterion. */
  position: number | null;
};

function getName(stats: CharacterStats) {
  return CHARACTERS.find((character) => character.id === stats.characterId)?.name ?? "";
}

export function isRateRanked(stats: CharacterStats, minMatches = MIN_RANKED_MATCHES) {
  return stats.winRate !== null && stats.eligible >= minMatches;
}

function criterionValue(stats: CharacterStats, criterion: RankingCriterion) {
  if (criterion === "wins") return stats.wins;
  if (criterion === "played") return stats.played;
  return stats.winRate ?? 0;
}

export function getRanking(
  history: readonly MatchResult[],
  { criterion = "wins", game, minMatches = MIN_RANKED_MATCHES }: {
    criterion?: RankingCriterion;
    /** Only that game's matches, when given. */
    game?: string;
    minMatches?: number;
  } = {},
): RankingEntry[] {
  const matches = normalizeHistory(history).filter((match) => !game || match.game === game);
  const ranked = (stats: CharacterStats) =>
    criterion !== "win-rate" || isRateRanked(stats, minMatches);

  const sorted = getAllCharacterStats(matches).sort(
    (a, b) =>
      Number(ranked(b)) - Number(ranked(a)) ||
      criterionValue(b, criterion) - criterionValue(a, criterion) ||
      b.eligible - a.eligible ||
      b.wins - a.wins ||
      getName(a).localeCompare(getName(b)),
  );

  let position = 0;
  return sorted.map((stats) => ({ stats, position: ranked(stats) ? ++position : null }));
}

/** The games that appear in the history, for the game filter. */
export function getPlayedGames(history: readonly MatchResult[]): string[] {
  return [...new Set(normalizeHistory(history).map((match) => match.game))].sort();
}

/** Most recent first, optionally filtered by character and game. */
export function getRecentMatches(
  history: readonly MatchResult[],
  { characterId, game, limit }: { characterId?: string; game?: string; limit?: number } = {},
): MatchResult[] {
  const matches = normalizeHistory(history)
    .filter((match) => !game || match.game === game)
    .filter(
      (match) =>
        !characterId ||
        match.participants.some((seat) => seat.kind === "character" && seat.refId === characterId),
    )
    .reverse();
  return limit === undefined ? matches : matches.slice(0, limit);
}
