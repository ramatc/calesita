import { createPersistentStore } from "@/lib/storage";

function isNameList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((name) => typeof name === "string");
}

/** Names typed once stay available for the next games of the night. */
export const playerNamesStore = createPersistentStore<string[]>({
  key: "calesita:player-names",
  version: 1,
  fallback: [],
  validate: isNameList,
});
