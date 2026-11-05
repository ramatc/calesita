/** Derives time from a deadline, so throttled ticks or reloads cannot drift it. */
export function getRemainingSeconds(deadlineMs: number, nowMs: number): number {
  return Math.max(0, Math.ceil((deadlineMs - nowMs) / 1000));
}
