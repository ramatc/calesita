"use client";

import { useEffect, useRef, useState } from "react";

import { getRemainingMs, type Timer } from "@/lib/timer";

const TICK_MS = 200;

/**
 * Tracks a Timer and calls onExpire once when it runs out, including when the
 * page loads after the deadline passed. The interval is cleared on pause and unmount.
 */
export function useTimer(timer: Timer, onExpire: () => void): number {
  const [now, setNow] = useState(() => Date.now());
  const onExpireRef = useRef(onExpire);
  const { deadlineMs } = timer;

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    if (deadlineMs === null) return;

    const interval = setInterval(() => {
      const current = Date.now();
      setNow(current);

      if (current >= deadlineMs) {
        clearInterval(interval);
        onExpireRef.current();
      }
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [deadlineMs]);

  return getRemainingMs(timer, now);
}
