import type { SeatIdentity } from "@/lib/character-cast";
import type { MatchDraft, MatchOutcome, MatchTeam } from "@/lib/match-history";

/**
 * Builders that turn a finished game into a result. They read the outcome the game's
 * own rules produced; they never pick a winner the game did not.
 */

/** Highest score wins; a shared top is a tie, and nobody above zero means no winner. */
export function getScoreOutcome(scores: readonly number[]): {
  outcome: MatchOutcome;
  leaders: number[];
} {
  if (scores.length === 0) return { outcome: "no-winner", leaders: [] };
  const top = Math.max(...scores);
  if (top <= 0) return { outcome: "no-winner", leaders: [] };
  const leaders = scores.flatMap((score, index) => (score === top ? [index] : []));
  return { outcome: leaders.length === 1 ? "win" : "tie", leaders };
}

export function scoredPlayersResult(
  game: string,
  seats: readonly (SeatIdentity & { score: number })[],
): MatchDraft {
  const { outcome, leaders } = getScoreOutcome(seats.map((seat) => seat.score));
  return {
    game,
    kind: "competitive",
    outcome,
    participants: seats.map((seat) => ({ ...seat })),
    teams: [],
    winnerSeatIds: leaders.map((index) => seats[index].seatId),
    winnerTeamIds: [],
  };
}

export function scoredTeamsResult(
  game: string,
  teams: readonly (MatchTeam & { score: number })[],
  seats: readonly SeatIdentity[],
): MatchDraft {
  const { outcome, leaders } = getScoreOutcome(teams.map((team) => team.score));
  const winners = leaders.map((index) => teams[index]);
  return {
    game,
    kind: "competitive",
    outcome,
    participants: seats.map((seat) => ({
      ...seat,
      teamId: teams.find((team) => team.seatIds.includes(seat.seatId))?.id,
    })),
    teams: teams.map((team) => ({ ...team, seatIds: [...team.seatIds] })),
    winnerSeatIds: winners.flatMap((team) => team.seatIds),
    winnerTeamIds: winners.map((team) => team.id),
  };
}

/** For games whose rules name the winners directly, such as the last one standing. */
export function decidedResult(
  game: string,
  seats: readonly (SeatIdentity & { score?: number })[],
  winnerSeatIds: readonly string[],
  teams: readonly MatchTeam[] = [],
  winnerTeamIds: readonly string[] = [],
): MatchDraft {
  const known = winnerSeatIds.filter((id) => seats.some((seat) => seat.seatId === id));
  return {
    game,
    kind: "competitive",
    outcome: known.length === 0 ? "no-winner" : "win",
    participants: seats.map((seat) => ({
      ...seat,
      teamId: teams.find((team) => team.seatIds.includes(seat.seatId))?.id,
    })),
    teams: teams.map((team) => ({ ...team, seatIds: [...team.seatIds] })),
    winnerSeatIds: known,
    winnerTeamIds: [...winnerTeamIds],
  };
}

/** Games played for fun, with no winner by design. */
export function socialResult(game: string, seats: readonly SeatIdentity[]): MatchDraft {
  return {
    game,
    kind: "social",
    outcome: "social",
    participants: seats.map((seat) => ({ ...seat })),
    teams: [],
    winnerSeatIds: [],
    winnerTeamIds: [],
  };
}
