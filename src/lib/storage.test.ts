import { beforeEach, describe, expect, it, vi } from "vitest";

import { createPersistentStore } from "@/lib/storage";

function fakeStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
    values,
  };
}

const isNumberOrNull = (value: unknown): value is number | null =>
  value === null || typeof value === "number";

function createStore(storage: ReturnType<typeof fakeStorage>) {
  return createPersistentStore<number | null>({
    key: "test",
    version: 2,
    fallback: null,
    validate: isNumberOrNull,
    getStorage: () => storage,
  });
}

describe("createPersistentStore", () => {
  let storage: ReturnType<typeof fakeStorage>;

  beforeEach(() => {
    storage = fakeStorage();
  });

  it("returns the fallback when nothing is stored", () => {
    expect(createStore(storage).get()).toBeNull();
  });

  it("persists values in a versioned envelope that a new store can read", () => {
    createStore(storage).set(8);
    expect(JSON.parse(storage.values.get("test")!)).toEqual({ version: 2, data: 8 });
    expect(createStore(storage).get()).toBe(8);
  });

  it("falls back on corrupt JSON", () => {
    expect(createStore(fakeStorage({ test: "{not json" })).get()).toBeNull();
  });

  it("falls back on a different version", () => {
    const stored = JSON.stringify({ version: 1, data: 8 });
    expect(createStore(fakeStorage({ test: stored })).get()).toBeNull();
  });

  it("falls back on data that fails validation", () => {
    const stored = JSON.stringify({ version: 2, data: "eight" });
    expect(createStore(fakeStorage({ test: stored })).get()).toBeNull();
  });

  it("keeps working in memory when storage throws", () => {
    const store = createPersistentStore<number | null>({
      key: "test",
      version: 1,
      fallback: null,
      validate: isNumberOrNull,
      getStorage: () => {
        throw new Error("blocked");
      },
    });
    expect(store.get()).toBeNull();
    store.set(5);
    expect(store.get()).toBe(5);
  });

  it("notifies subscribers until they unsubscribe", () => {
    const store = createStore(storage);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.set(3);
    unsubscribe();
    store.set(4);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
