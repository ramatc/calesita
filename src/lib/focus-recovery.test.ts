import { describe, expect, it } from "vitest";

import { isFocusLost, pickFocusTarget } from "@/lib/focus-recovery";

const body = { isConnected: true };

describe("isFocusLost", () => {
  it("is lost when focus fell back to the body or nowhere", () => {
    expect(isFocusLost(body, body)).toBe(true);
    expect(isFocusLost(null, body)).toBe(true);
  });

  it("is lost when the focused control was removed from the page", () => {
    expect(isFocusLost({ isConnected: false }, body)).toBe(true);
  });

  it("keeps focus that is still on a live control", () => {
    expect(isFocusLost({ isConnected: true }, body)).toBe(false);
  });
});

describe("pickFocusTarget", () => {
  const context = "status";
  const firstAction = "pause";

  it("lands on the new context when the stage changes, such as starting or finishing", () => {
    expect(pickFocusTarget(true, { context, firstAction })).toBe("status");
  });

  it("lands on the next action within a stage, such as after starting the clock", () => {
    expect(pickFocusTarget(false, { context, firstAction })).toBe("pause");
  });

  it("falls back to whichever target exists", () => {
    expect(pickFocusTarget(true, { context: null, firstAction })).toBe("pause");
    expect(pickFocusTarget(false, { context, firstAction: null })).toBe("status");
    expect(pickFocusTarget(false, { context: null, firstAction: null })).toBeNull();
  });
});
