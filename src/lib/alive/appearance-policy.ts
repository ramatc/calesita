import { ALIVE_MESSAGES, type AliveContext, type AliveMessage } from "@/content/alive-messages";
import type { CharacterId } from "@/types/character";

/**
 * Pure rules for Calesita Alive: who appears, with which line, and whether anything
 * appears at all. Randomness only picks among decorative options; it never touches a game.
 */

export type AliveConfig = {
  /** Minimum time between two decorative appearances. */
  cooldownMs: number;
  /** Decorative appearances allowed per browser session. */
  sessionLimit: number;
};

export const DEFAULT_ALIVE_CONFIG: AliveConfig = {
  cooldownMs: 90_000,
  sessionLimit: 4,
};

/** What the session remembers, kept in sessionStorage. */
export type AliveSessionLog = {
  count: number;
  lastAt: number | null;
  lastCharacterId: CharacterId | null;
  lastMessageId: string | null;
  /** Contexts already shown this session, so a welcome does not repeat on every visit. */
  shown: readonly AliveContext[];
};

export const EMPTY_SESSION_LOG: AliveSessionLog = {
  count: 0,
  lastAt: null,
  lastCharacterId: null,
  lastMessageId: null,
  shown: [],
};

export type Random = () => number;

function pickFrom<T>(items: readonly T[], random: Random): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.min(items.length - 1, Math.floor(random() * items.length))];
}

/** Prefers what differs from the last pick, but never returns nothing when options exist. */
function pickAvoiding<T>(items: readonly T[], avoid: (item: T) => boolean, random: Random) {
  const fresh = items.filter((item) => !avoid(item));
  return pickFrom(fresh.length > 0 ? fresh : items, random);
}

/** Present characters first; with nobody marked, any of the seven. */
export function getEligibleCharacters(
  present: readonly CharacterId[],
  all: readonly CharacterId[],
): readonly CharacterId[] {
  const marked = present.filter((id) => all.includes(id));
  return marked.length > 0 ? marked : all;
}

export function pickCharacter(
  present: readonly CharacterId[],
  all: readonly CharacterId[],
  last: CharacterId | null,
  random: Random,
): CharacterId | undefined {
  return pickAvoiding(getEligibleCharacters(present, all), (id) => id === last, random);
}

export function pickMessage(
  context: AliveContext,
  last: string | null,
  random: Random,
): AliveMessage | undefined {
  return pickAvoiding(ALIVE_MESSAGES[context], (message) => message.id === last, random);
}

export type DecorativeGate = {
  now: number;
  /** A match is being played somewhere: decorative cameos stay quiet. */
  matchInProgress: boolean;
  config?: AliveConfig;
};

/** Whether a decorative appearance may start, before choosing anything. */
export function canAppear(
  log: AliveSessionLog,
  context: AliveContext,
  { now, matchInProgress, config = DEFAULT_ALIVE_CONFIG }: DecorativeGate,
): boolean {
  if (matchInProgress) return false;
  if (log.count >= config.sessionLimit) return false;
  if (log.shown.includes(context)) return false;
  if (log.lastAt !== null && now - log.lastAt < config.cooldownMs) return false;
  return true;
}

export type Appearance = {
  context: AliveContext;
  characterId: CharacterId;
  message: AliveMessage;
};

export type PlanInput = DecorativeGate & {
  context: AliveContext;
  log: AliveSessionLog;
  present: readonly CharacterId[];
  all: readonly CharacterId[];
  random: Random;
};

/** One decorative appearance, or null when the rules say to stay quiet. */
export function planAppearance(input: PlanInput): Appearance | null {
  if (!canAppear(input.log, input.context, input)) return null;
  const characterId = pickCharacter(input.present, input.all, input.log.lastCharacterId, input.random);
  const message = pickMessage(input.context, input.log.lastMessageId, input.random);
  if (!characterId || !message) return null;
  return { context: input.context, characterId, message };
}

export function recordAppearance(
  log: AliveSessionLog,
  appearance: Appearance,
  now: number,
): AliveSessionLog {
  return {
    count: log.count + 1,
    lastAt: now,
    lastCharacterId: appearance.characterId,
    lastMessageId: appearance.message.id,
    shown: log.shown.includes(appearance.context) ? log.shown : [...log.shown, appearance.context],
  };
}

export type ResultCharacters = {
  winners: readonly { id: CharacterId }[];
  tied: readonly { id: CharacterId }[];
  losers: readonly { id: CharacterId }[];
};

export type ResultReaction = { context: "victory" | "defeat"; characterId: CharacterId };

/**
 * The line that accompanies a finished game, from the results the engine already
 * reported. A tie or a social game without winners gets no victory line.
 */
export function pickResultReaction(
  { winners, tied, losers }: ResultCharacters,
  random: Random,
): ResultReaction | null {
  if (winners.length > 0) {
    const winner = pickFrom(winners, random);
    return winner ? { context: "victory", characterId: winner.id } : null;
  }
  if (tied.length > 0) return null;
  const loser = pickFrom(losers, random);
  return loser ? { context: "defeat", characterId: loser.id } : null;
}

export function isSessionLog(value: unknown): value is AliveSessionLog {
  if (typeof value !== "object" || value === null) return false;
  const log = value as Record<string, unknown>;
  return (
    typeof log.count === "number" &&
    Number.isFinite(log.count) &&
    (log.lastAt === null || typeof log.lastAt === "number") &&
    (log.lastCharacterId === null || typeof log.lastCharacterId === "string") &&
    (log.lastMessageId === null || typeof log.lastMessageId === "string") &&
    Array.isArray(log.shown) &&
    log.shown.every((context) => typeof context === "string" && context in ALIVE_MESSAGES)
  );
}
