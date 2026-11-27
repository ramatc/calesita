/**
 * Where focus goes when the focused control disappears mid-game (it was unmounted by
 * the action it triggered). Focus that is still on a live element is never moved.
 */

/** "playing" has a status bar; setup and results screens are "static". */
export type FrameStage = "playing" | "static";

type FocusLike = { isConnected: boolean };

export function isFocusLost<T extends FocusLike>(active: T | null, body: T | null): boolean {
  return active === null || active === body || !active.isConnected;
}

/**
 * A new stage moves focus to its context (the round status, or the screen title), so a
 * screen reader announces where the player landed. Within a stage, focus goes to the
 * next thing to do. Each falls back to the other when missing.
 */
export function pickFocusTarget<T>(
  stageChanged: boolean,
  { context, firstAction }: { context: T | null; firstAction: T | null },
): T | null {
  return stageChanged ? (context ?? firstAction) : (firstAction ?? context);
}
