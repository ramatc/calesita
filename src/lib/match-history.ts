import type { SeatIdentity } from "@/lib/character-cast";
import { createPersistentStore, type PersistentStore } from "@/lib/storage";

/**
 * Finished games, kept for future stats. Only games that really ended are recorded:
 * a game abandoned with "end" never reaches this module.
 */

export const MATCH_KINDS = ["competitive", "social"] as const;
export type MatchKind = (typeof MATCH_KINDS)[number];

/** "social" is for games that have no winner by design. */
export const MATCH_OUTCOMES = ["win", "tie", "no-winner", "social"] as const;
export type MatchOutcome = (typeof MATCH_OUTCOMES)[number];

export type MatchParticipant = SeatIdentity & {
  /** The team this seat played for, in team games. */
  teamId?: string;
  /** The individual score, when the game keeps one per player. */
  score?: number;
};

export type MatchTeam = {
  id: string;
  name: string;
  seatIds: string[];
  score?: number;
};

export type MatchResult = {
  id: string;
  game: string;
  /** ISO 8601. */
  playedAt: string;
  kind: MatchKind;
  outcome: MatchOutcome;
  participants: MatchParticipant[];
  teams: MatchTeam[];
  winnerSeatIds: string[];
  winnerTeamIds: string[];
};

/** The part of a result each game builds; id and date come from the match tracker. */
export type MatchDraft = Omit<MatchResult, "id" | "playedAt">;

export const MAX_STORED_MATCHES = 500;

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isOptionalScore(value: unknown) {
  return value === undefined || (typeof value === "number" && Number.isFinite(value));
}

function isMatchParticipant(value: unknown): value is MatchParticipant {
  if (typeof value !== "object" || value === null) return false;
  const seat = value as Partial<MatchParticipant>;
  return (
    typeof seat.seatId === "string" &&
    typeof seat.name === "string" &&
    (seat.kind === "character" || seat.kind === "guest" || seat.kind === "generic") &&
    (seat.refId === undefined || typeof seat.refId === "string") &&
    (seat.teamId === undefined || typeof seat.teamId === "string") &&
    isOptionalScore(seat.score)
  );
}

function isMatchTeam(value: unknown): value is MatchTeam {
  if (typeof value !== "object" || value === null) return false;
  const team = value as Partial<MatchTeam>;
  return (
    typeof team.id === "string" &&
    typeof team.name === "string" &&
    isStringList(team.seatIds) &&
    isOptionalScore(team.score)
  );
}

export function isMatchResult(value: unknown): value is MatchResult {
  if (typeof value !== "object" || value === null) return false;
  const match = value as Partial<MatchResult>;
  return (
    typeof match.id === "string" &&
    match.id.length > 0 &&
    typeof match.game === "string" &&
    typeof match.playedAt === "string" &&
    !Number.isNaN(Date.parse(match.playedAt)) &&
    MATCH_KINDS.some((kind) => kind === match.kind) &&
    MATCH_OUTCOMES.some((outcome) => outcome === match.outcome) &&
    Array.isArray(match.participants) &&
    match.participants.every(isMatchParticipant) &&
    Array.isArray(match.teams) &&
    match.teams.every(isMatchTeam) &&
    isStringList(match.winnerSeatIds) &&
    isStringList(match.winnerTeamIds)
  );
}

/**
 * The envelope only checks for a list, so one bad entry never wipes the history:
 * readers go through getMatchHistory, which drops what does not validate.
 */
export function createMatchHistoryStore(
  getStorage?: () => Pick<Storage, "getItem" | "setItem"> | undefined,
) {
  return createPersistentStore<unknown[]>({
    key: "calesita:match-history",
    version: 1,
    fallback: [],
    validate: Array.isArray,
    getStorage,
  });
}

export const matchHistoryStore = createMatchHistoryStore();

export function getMatchHistory(store: PersistentStore<unknown[]> = matchHistoryStore) {
  return store.get().filter(isMatchResult);
}

/** Adds a result once. Returns false when that match id was already recorded. */
export function recordMatch(
  result: MatchResult,
  store: PersistentStore<unknown[]> = matchHistoryStore,
): boolean {
  if (!isMatchResult(result)) return false;
  const history = getMatchHistory(store);
  if (history.some((match) => match.id === result.id)) return false;
  store.set([...history, result].slice(-MAX_STORED_MATCHES));
  return true;
}

function isIdRecord(value: unknown): value is Record<string, string> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every((item) => typeof item === "string")
  );
}

/** Game slug to the id of the match being played and not yet recorded. */
export const pendingMatchStore = createPersistentStore<Record<string, string>>({
  key: "calesita:pending-matches",
  version: 1,
  fallback: {},
  validate: isIdRecord,
});

export function createMatchId(): string {
  const random =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
  return `match-${random}`;
}

/**
 * A match gets an id while it is played, and gives it up when it is recorded.
 * Seeing the same finished game again (a reload, a re-render) finds no pending id,
 * so it is never recorded twice; the next game played gets a fresh one.
 */
export function createMatchTracker(
  pending: PersistentStore<Record<string, string>> = pendingMatchStore,
  history: PersistentStore<unknown[]> = matchHistoryStore,
  now: () => Date = () => new Date(),
) {
  return {
    begin(game: string) {
      if (pending.get()[game]) return;
      pending.set({ ...pending.get(), [game]: createMatchId() });
    },
    finish(game: string, draft: MatchDraft): MatchResult | null {
      const id = pending.get()[game];
      if (!id) return null;
      const rest = { ...pending.get() };
      delete rest[game];
      pending.set(rest);
      const result: MatchResult = { ...draft, id, game, playedAt: now().toISOString() };
      return recordMatch(result, history) ? result : null;
    },
  };
}

export const matchTracker = createMatchTracker();
