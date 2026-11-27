"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

import { isFocusLost, pickFocusTarget, type FrameStage } from "@/lib/focus-recovery";

const ACTIONS =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

function isVisible(element: Element) {
  return element.getClientRects().length > 0;
}

function focusTarget(element: HTMLElement) {
  if (!element.matches(ACTIONS) && !element.hasAttribute("tabindex")) {
    element.setAttribute("tabindex", "-1");
  }
  element.focus();
}

/**
 * Keeps keyboard and screen reader users in place when the control they used is
 * unmounted by its own action (a start button, a judge button, "Play again").
 * Watches the frame's DOM, so it also covers changes made by nested components.
 */
export function useFocusRecovery(
  root: RefObject<HTMLElement | null>,
  status: RefObject<HTMLElement | null>,
  content: RefObject<HTMLElement | null>,
  stage: FrameStage,
) {
  const stageRef = useRef(stage);
  const focusedStage = useRef<FrameStage | null>(null);

  // A layout effect, so the stage is current before the DOM observer runs for this commit.
  useLayoutEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    const frame = root.current;
    if (!frame) return;

    function handleFocusIn() {
      focusedStage.current = stageRef.current;
    }

    function handleFocusOut(event: FocusEvent) {
      const next = event.relatedTarget;
      // Moving to another control outside the frame is a choice; a confirmation dialog
      // opened from the frame still belongs to it, since it returns focus here.
      if (next instanceof Element && !frame?.contains(next) && !next.closest('[role="alertdialog"]')) {
        focusedStage.current = null;
      }
    }

    function recover() {
      if (focusedStage.current === null) return;
      if (!isFocusLost(document.activeElement, document.body)) return;

      const stageChanged = focusedStage.current !== stageRef.current;
      const heading = content.current?.querySelector("h1");
      const statusBar = status.current;
      const context =
        stageRef.current === "playing" && statusBar && isVisible(statusBar)
          ? statusBar
          : (heading ?? null);
      const firstAction =
        [...(content.current?.querySelectorAll<HTMLElement>(ACTIONS) ?? [])].find(isVisible) ?? null;

      const target = pickFocusTarget(stageChanged, {
        context: context as HTMLElement | null,
        firstAction,
      });
      if (target) focusTarget(target);
    }

    const observer = new MutationObserver(recover);
    observer.observe(frame, { childList: true, subtree: true });
    frame.addEventListener("focusin", handleFocusIn);
    frame.addEventListener("focusout", handleFocusOut);
    return () => {
      observer.disconnect();
      frame.removeEventListener("focusin", handleFocusIn);
      frame.removeEventListener("focusout", handleFocusOut);
    };
  }, [root, status, content]);
}
