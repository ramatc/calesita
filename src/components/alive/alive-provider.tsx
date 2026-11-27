"use client";

import { createContext, useContext, useMemo, useRef, type ReactNode } from "react";

type AliveStage = {
  /** Takes the single decorative spot. Returns false when another slot holds it. */
  claim: (slot: string) => boolean;
  release: (slot: string) => void;
};

const AliveContext = createContext<AliveStage | null>(null);

/** Guarantees at most one decorative appearance on screen at a time. */
export function AliveProvider({ children }: { children: ReactNode }) {
  const active = useRef<string | null>(null);

  const stage = useMemo<AliveStage>(
    () => ({
      claim(slot) {
        if (active.current !== null && active.current !== slot) return false;
        active.current = slot;
        return true;
      },
      release(slot) {
        if (active.current === slot) active.current = null;
      },
    }),
    [],
  );

  return <AliveContext.Provider value={stage}>{children}</AliveContext.Provider>;
}

export function useAliveStage(): AliveStage | null {
  return useContext(AliveContext);
}
