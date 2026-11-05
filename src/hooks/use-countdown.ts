"use client";

import { useEffect, useRef, useState } from "react";

import { getRemainingSeconds } from "@/lib/time";

const TICK_MS = 100;

/** Counts down from mount and calls onDone once. The interval is cleared on unmount. */
export function useCountdown(seconds: number, onDone: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    const deadline = Date.now() + seconds * 1000;

    const interval = setInterval(() => {
      const left = getRemainingSeconds(deadline, Date.now());
      setRemaining(left);

      if (left === 0) {
        clearInterval(interval);
        onDoneRef.current();
      }
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [seconds]);

  return remaining;
}
