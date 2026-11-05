"use client";

import { useSyncExternalStore } from "react";

import type { PersistentStore } from "@/lib/storage";

/** Renders the fallback on the server, then the stored value after hydration. */
export function usePersistentStore<T>(store: PersistentStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.getFallback);
}
