import { createPersistentStore } from "@/lib/storage";

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 20;

function isPlayerCount(value: unknown): value is number | null {
  return (
    value === null ||
    (typeof value === "number" &&
      Number.isInteger(value) &&
      value >= MIN_PLAYERS &&
      value <= MAX_PLAYERS)
  );
}

/** The group size, shared by the catalog filter and Sorprendeme. Null means unknown. */
export const playerCountStore = createPersistentStore<number | null>({
  key: "calesita:player-count",
  version: 1,
  fallback: null,
  validate: isPlayerCount,
});
