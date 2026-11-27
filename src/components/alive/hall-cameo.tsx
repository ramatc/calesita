"use client";

import { useEffect, useState } from "react";

import { useAliveStage } from "@/components/alive/alive-provider";
import { AliveSlot } from "@/components/alive/alive-slot";
import { CharacterReaction } from "@/components/characters/character-reaction";
import { ALIVE_MESSAGES, fillMessage } from "@/content/alive-messages";
import { CHARACTERS, getCharacterById } from "@/content/characters";
import { pickMessage } from "@/lib/alive/appearance-policy";
import { diffSeenAchievements, getUnlockedKeys, seenAchievementsStore } from "@/lib/alive/seen-achievements";
import { ACHIEVEMENTS } from "@/lib/hall-of-fame/achievements";
import { normalizeHistory } from "@/lib/hall-of-fame/stats";
import { isMatchResult, matchHistoryStore } from "@/lib/match-history";
import type { CharacterId } from "@/types/character";

const SETTLE_MS = 700;
const SLOT = "hall";
const ALL_IDS: readonly CharacterId[] = CHARACTERS.map((character) => character.id);

type Celebration = { characterId: CharacterId; achievementName: string; text: string; more: number };

/**
 * Celebrates achievements unlocked since the last visit, once. With nothing new, the
 * spot may show an ordinary welcome, under the usual frequency rules.
 */
export function HallCameo() {
  const stage = useAliveStage();
  const [state, setState] = useState<"pending" | "quiet" | Celebration>("pending");

  useEffect(() => {
    const timer = setTimeout(() => {
      // Read the stores here, not render props: during hydration the first render sees
      // an empty history, and baselining on it would celebrate the whole past next visit.
      const history = normalizeHistory(matchHistoryStore.get().filter(isMatchResult));
      const { fresh, next } = diffSeenAchievements(getUnlockedKeys(history, ALL_IDS), seenAchievementsStore.get());
      seenAchievementsStore.set(next);

      const [key] = fresh;
      const [characterId, achievementId] = key?.split(":") ?? [];
      const character = characterId ? getCharacterById(characterId) : undefined;
      const achievement = ACHIEVEMENTS.find((entry) => entry.id === achievementId);
      const message = pickMessage("achievement", null, Math.random) ?? ALIVE_MESSAGES.achievement[0];

      if (character && achievement && (!stage || stage.claim(SLOT))) {
        setState({
          characterId: character.id,
          achievementName: achievement.name,
          text: fillMessage(message.text, { name: character.name, achievement: achievement.name }),
          more: fresh.length - 1,
        });
        return;
      }
      setState("quiet");
    }, SETTLE_MS);

    return () => {
      clearTimeout(timer);
      stage?.release(SLOT);
    };
  }, [stage]);

  if (state === "pending") return null;
  if (state === "quiet") {
    return (
      <AliveSlot
        slot="hall-visit"
        context="hallVisit"
        side="left"
        media="(min-width: 1024px)"
        className="absolute top-8 right-8"
      />
    );
  }

  const character = getCharacterById(state.characterId);
  if (!character) return null;

  return (
    <div
      role="status"
      className="arcade-edge mt-6 flex items-center gap-4 rounded-arcade-card bg-arcade-yellow p-3 text-arcade-ink"
    >
      <CharacterReaction character={character} reaction="celebration" size="sm" />
      <p className="font-semibold">
        <span className="pixel-label block">Nuevo logro</span>
        {state.text}
        {state.more > 0 && ` Y ${state.more} ${state.more === 1 ? "logro nuevo más" : "logros nuevos más"}.`}
      </p>
    </div>
  );
}
