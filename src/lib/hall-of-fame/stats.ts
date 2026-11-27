import { CHARACTERS } from "@/content/characters";
import type { MatchResult } from "@/lib/match-history";
import type { CharacterId } from "@/types/character";

/**
 * Stats derived from the stored match history. Nothing here is persisted: every number
 * is recomputed from the real results, so it can never drift from them.
 *
 * Per character and match, a result is one of:
 * - "win":  a competitive match with a single winning side, and the character was on it.
 * - "tie":  two or more sides shared the top, and the character was on one of them.
 * - "loss": a decided match (win or tie) where the character was below the top.
 * - "social": a game with no winner by design. Only a participation, never a loss.
 * - "ambiguous": no winner, or a result whose data does not add up. Only a participation.
 *
 * Eligible competitive matches = wins + losses + ties. The win rate is wins / eligible.
 * Only seats played by one of the seven characters count; guests and generic players
 * appear in the history but have no stats.
 */

export type SeatResult = "win" | "tie" | "loss" | "social" | "ambiguous";

export const ELIGIBLE_RESULTS: readonly SeatResult[] = ["win", "tie", "loss"];

export function isEligible(result: SeatResult) {
  return ELIGIBLE_RESULTS.includes(result);
}

/** Drops repeated match ids (the first one stays) and orders by date, then id. */
export function normalizeHistory(history: readonly MatchResult[]): MatchResult[] {
  const seen = new Set<string>();
  const unique = history.filter((match) => {
    if (seen.has(match.id)) return false;
    seen.add(match.id);
    return true;
  });
  return unique.sort(
    (a, b) =>
      Date.parse(a.playedAt) - Date.parse(b.playedAt) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  );
}

function sameSet(a: readonly string[], b: readonly string[]) {
  const left = new Set(a);
  const right = new Set(b);
  return left.size === right.size && [...left].every((item) => right.has(item));
}

/** Whether the winners a match stored are consistent enough to decide wins and losses. */
function isDecided(match: MatchResult): boolean {
  if (match.kind !== "competitive") return false;
  if (match.outcome !== "win" && match.outcome !== "tie") return false;

  const seatIds = new Set(match.participants.map((seat) => seat.seatId));
  if (seatIds.size !== match.participants.length) return false;
  if (match.winnerSeatIds.length === 0) return false;
  if (!match.winnerSeatIds.every((id) => seatIds.has(id))) return false;
  if (match.winnerSeatIds.length === match.participants.length && match.outcome === "win") {
    // Everyone won: there is nobody to have lost against.
    return false;
  }

  if (match.winnerTeamIds.length > 0) {
    const winners = match.winnerTeamIds.map((id) => match.teams.find((team) => team.id === id));
    if (winners.some((team) => team === undefined)) return false;
    if (!sameSet(match.winnerSeatIds, winners.flatMap((team) => team!.seatIds))) return false;
    const sides = match.winnerTeamIds.length;
    return match.outcome === "win" ? sides === 1 : sides >= 2;
  }

  if (match.teams.length > 0) return false;
  return match.outcome === "win" || match.winnerSeatIds.length >= 2;
}

export function getSeatResult(match: MatchResult, seatId: string): SeatResult {
  if (match.kind === "social") return match.outcome === "social" ? "social" : "ambiguous";
  if (!isDecided(match)) return "ambiguous";
  if (!match.winnerSeatIds.includes(seatId)) return "loss";
  return match.outcome === "win" ? "win" : "tie";
}

/** The character's result in a match, or null when the character did not play it. */
export function getCharacterResult(match: MatchResult, characterId: CharacterId): SeatResult | null {
  const seats = match.participants.filter(
    (seat) => seat.kind === "character" && seat.refId === characterId,
  );
  if (seats.length === 0) return null;
  // The same character on two seats cannot be scored honestly.
  if (seats.length > 1) return "ambiguous";
  return getSeatResult(match, seats[0].seatId);
}

export type CharacterMatch = { match: MatchResult; result: SeatResult };

export type CharacterStats = {
  characterId: CharacterId;
  /** Every recorded match the character played, social ones included. */
  played: number;
  eligible: number;
  wins: number;
  losses: number;
  ties: number;
  /** wins / eligible, or null with no eligible match. */
  winRate: number | null;
  /** Games by times played, most played first. */
  topGames: { game: string; played: number }[];
  /** Chronological, oldest first. */
  matches: CharacterMatch[];
};

export function getCharacterStats(
  history: readonly MatchResult[],
  characterId: CharacterId,
): CharacterStats {
  const matches = normalizeHistory(history).flatMap((match) => {
    const result = getCharacterResult(match, characterId);
    return result ? [{ match, result }] : [];
  });
  const count = (result: SeatResult) => matches.filter((entry) => entry.result === result).length;
  const wins = count("win");
  const losses = count("loss");
  const ties = count("tie");
  const eligible = wins + losses + ties;

  const byGame = new Map<string, number>();
  for (const { match } of matches) byGame.set(match.game, (byGame.get(match.game) ?? 0) + 1);
  const topGames = [...byGame]
    .map(([game, played]) => ({ game, played }))
    .sort((a, b) => b.played - a.played || a.game.localeCompare(b.game));

  return {
    characterId,
    played: matches.length,
    eligible,
    wins,
    losses,
    ties,
    winRate: eligible === 0 ? null : wins / eligible,
    topGames,
    matches,
  };
}

export function getAllCharacterStats(history: readonly MatchResult[]): CharacterStats[] {
  return CHARACTERS.map((character) => getCharacterStats(history, character.id));
}
