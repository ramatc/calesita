import { describe, expect, it } from "vitest";

import {
  createTimer,
  formatClock,
  getRemainingMs,
  isTimer,
  pauseTimer,
  startTimer,
} from "@/lib/timer";

describe("timer", () => {
  it("starts stopped with the full duration", () => {
    const timer = createTimer(60);
    expect(timer.deadlineMs).toBeNull();
    expect(getRemainingMs(timer, 999_999)).toBe(60_000);
  });

  it("counts down from the clock while running", () => {
    const timer = startTimer(createTimer(60), 1_000);
    expect(getRemainingMs(timer, 1_000)).toBe(60_000);
    expect(getRemainingMs(timer, 11_000)).toBe(50_000);
  });

  it("keeps counting across a reload, because it only stores a deadline", () => {
    const stored = JSON.parse(JSON.stringify(startTimer(createTimer(60), 1_000)));
    expect(getRemainingMs(stored, 31_000)).toBe(30_000);
  });

  it("freezes while paused and resumes from the same time", () => {
    const paused = pauseTimer(startTimer(createTimer(60), 0), 10_000);
    expect(paused.deadlineMs).toBeNull();
    expect(getRemainingMs(paused, 500_000)).toBe(50_000);

    const resumed = startTimer(paused, 500_000);
    expect(getRemainingMs(resumed, 505_000)).toBe(45_000);
  });

  it("never goes below zero", () => {
    expect(getRemainingMs(startTimer(createTimer(10), 0), 60_000)).toBe(0);
  });

  it("does not exceed the time left if the clock reads behind the deadline's start", () => {
    expect(getRemainingMs(startTimer(createTimer(10), 5_000), 4_000)).toBe(10_000);
  });

  it("does not change when pausing a stopped timer", () => {
    const timer = createTimer(10);
    expect(pauseTimer(timer, 5_000)).toBe(timer);
  });

  it("validates stored timers", () => {
    expect(isTimer(startTimer(createTimer(10), 0))).toBe(true);
    expect(isTimer({ durationMs: 1, remainingMs: "x", deadlineMs: null })).toBe(false);
    expect(isTimer(null)).toBe(false);
  });
});

describe("formatClock", () => {
  it("shows minutes and seconds, rounding up", () => {
    expect(formatClock(60_000)).toBe("1:00");
    expect(formatClock(59_001)).toBe("1:00");
    expect(formatClock(5_000)).toBe("0:05");
    expect(formatClock(0)).toBe("0:00");
  });
});
