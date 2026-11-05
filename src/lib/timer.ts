/**
 * A serializable countdown. It stores a deadline instead of counting ticks, so
 * it stays correct across reloads, throttled tabs and locked phones.
 */
export type Timer = {
  durationMs: number;
  remainingMs: number;
  /** Set while running; null while stopped or paused. */
  deadlineMs: number | null;
};

export function createTimer(seconds: number): Timer {
  const durationMs = seconds * 1000;
  return { durationMs, remainingMs: durationMs, deadlineMs: null };
}

/** Starts a stopped timer or resumes a paused one. */
export function startTimer(timer: Timer, nowMs: number): Timer {
  return { ...timer, deadlineMs: nowMs + timer.remainingMs };
}

export function getRemainingMs(timer: Timer, nowMs: number): number {
  if (timer.deadlineMs === null) return timer.remainingMs;
  return Math.max(0, Math.min(timer.remainingMs, timer.deadlineMs - nowMs));
}

export function pauseTimer(timer: Timer, nowMs: number): Timer {
  if (timer.deadlineMs === null) return timer;
  return { ...timer, remainingMs: getRemainingMs(timer, nowMs), deadlineMs: null };
}

export function formatClock(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const seconds = totalSeconds % 60;
  return `${Math.floor(totalSeconds / 60)}:${String(seconds).padStart(2, "0")}`;
}

export function isTimer(value: unknown): value is Timer {
  if (typeof value !== "object" || value === null) return false;
  const timer = value as Partial<Timer>;
  return (
    typeof timer.durationMs === "number" &&
    typeof timer.remainingMs === "number" &&
    (timer.deadlineMs === null || typeof timer.deadlineMs === "number")
  );
}
