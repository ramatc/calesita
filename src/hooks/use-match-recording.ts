"use client";

import { useEffect, useRef } from "react";

import { matchTracker, type MatchDraft } from "@/lib/match-history";

export type MatchStatus = "idle" | "playing" | "finished";

/**
 * Opens a match while a game is played and records it once when the game's own rules
 * end it. Pass "idle" for setup screens and for games ended early with "end".
 */
export function useMatchRecording(slug: string, status: MatchStatus, build: () => MatchDraft | null | undefined) {
  const buildRef = useRef(build);

  useEffect(() => {
    buildRef.current = build;
  });

  useEffect(() => {
    if (status === "playing") matchTracker.begin(slug);
    if (status !== "finished") return;
    const draft = buildRef.current();
    if (draft) matchTracker.finish(slug, draft);
  }, [slug, status]);
}
