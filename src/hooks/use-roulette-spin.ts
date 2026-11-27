"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { drawIndex, planSpin } from "@/lib/roulette";

export const SPIN_DURATION_MS = 4200;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Owns the wheel rotation. The winner is drawn before the wheel moves and the rotation
 * is planned to stop on it, so the segment under the pointer is always the announced one.
 * `key` identifies the wheel contents; a different wheel discards the old result.
 */
export function useRouletteSpin(count: number, key: string) {
  const [rotation, setRotation] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [result, setResult] = useState<{ key: string; index: number } | null>(null);
  const [spinning, setSpinning] = useState(false);
  const pending = useRef<number | null>(null);
  const fallback = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback(() => {
    if (pending.current === null) return;
    if (fallback.current) clearTimeout(fallback.current);
    setResult({ key, index: pending.current });
    pending.current = null;
    setSpinning(false);
  }, [key]);

  useEffect(
    () => () => {
      if (fallback.current) clearTimeout(fallback.current);
    },
    [],
  );

  const spin = useCallback(() => {
    if (count === 0 || pending.current !== null) return;
    const drawn = drawIndex(count);
    const reduced = prefersReducedMotion();
    pending.current = drawn;
    setResult(null);
    setAnimate(!reduced);
    setRotation((current) => planSpin(current, drawn, count, Math.random(), reduced ? 0 : 5));
    if (reduced) {
      finish();
      return;
    }
    setSpinning(true);
    // transitionend can be skipped (hidden tab, interrupted transition); never hang.
    fallback.current = setTimeout(finish, SPIN_DURATION_MS + 300);
  }, [count, finish]);

  const winner = result && result.key === key ? result.index : null;

  return { rotation, animate, spinning, winner, spin, onSpinEnd: finish };
}
