"use client";

import { useCallback } from "react";

import { usePersistentStore } from "@/hooks/use-persistent-store";
import type { PersistentStore } from "@/lib/storage";

/** Runs a pure game reducer on top of a persistent store, so a game survives reloads. */
export function useGameSession<State, Action>(
  store: PersistentStore<State>,
  reducer: (state: State, action: Action) => State,
) {
  const state = usePersistentStore(store);
  const dispatch = useCallback(
    (action: Action) => store.set(reducer(store.get(), action)),
    [store, reducer],
  );

  return [state, dispatch] as const;
}
