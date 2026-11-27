"use client";

import { useEffect, useState } from "react";

import { useAliveStage } from "@/components/alive/alive-provider";
import { CharacterCameo } from "@/components/alive/character-cameo";
import { fillMessage, type AliveContext } from "@/content/alive-messages";
import { CHARACTERS, getCharacterById } from "@/content/characters";
import { planAppearance, recordAppearance, type Appearance } from "@/lib/alive/appearance-policy";
import { aliveSessionStore } from "@/lib/alive/session-log";
import { characterRosterStore } from "@/lib/character-cast";
import { cn } from "@/lib/utils";
import type { CharacterId } from "@/types/character";

/** A short wait means a quick pass through a page never triggers anything. */
const SETTLE_MS = 700;
/** How long the cameo stays before it steps out. */
const VISIBLE_MS = 7_000;
const ALL_IDS: readonly CharacterId[] = CHARACTERS.map((character) => character.id);

type AliveSlotProps = {
  /** A stable name for this place in the layout. */
  slot: string;
  context: AliveContext;
  side?: "left" | "right";
  /** Media query that must match for the slot to be used, e.g. "(min-width: 1024px)". */
  media?: string;
  className?: string;
};

/**
 * A fixed spot in the layout where a character may appear. The spot is positioned by
 * its parent, so showing or hiding the cameo never moves other content. Everything
 * inside is decorative and hidden from assistive tech.
 */
export function AliveSlot({ slot, context, side, media, className }: AliveSlotProps) {
  const stage = useAliveStage();
  const [appearance, setAppearance] = useState<Appearance | null>(null);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const settleTimer = setTimeout(() => {
      if (media && !window.matchMedia(media).matches) return;
      if (stage && !stage.claim(slot)) return;

      const now = Date.now();
      const log = aliveSessionStore.get();
      const planned = planAppearance({
        context,
        log,
        now,
        // Slots only live on screens outside active play (home, catalog, setup, hall).
        // The pending-match store is not a signal: abandoned matches stay listed there.
        matchInProgress: false,
        present: characterRosterStore.get().filter((id): id is CharacterId => ALL_IDS.includes(id as CharacterId)),
        all: ALL_IDS,
        random: Math.random,
      });

      if (!planned) {
        stage?.release(slot);
        return;
      }

      aliveSessionStore.set(recordAppearance(log, planned, now));
      setAppearance(planned);
      hideTimer = setTimeout(() => {
        setAppearance(null);
        stage?.release(slot);
      }, VISIBLE_MS);
    }, SETTLE_MS);

    return () => {
      clearTimeout(settleTimer);
      clearTimeout(hideTimer);
      stage?.release(slot);
    };
  }, [stage, slot, context, media]);

  const character = appearance ? getCharacterById(appearance.characterId) : undefined;

  return (
    <div aria-hidden="true" data-alive-slot={slot} className={cn("pointer-events-none", className)}>
      {appearance && character && (
        <CharacterCameo
          character={character}
          side={side}
          text={fillMessage(appearance.message.text, { name: character.name })}
        />
      )}
    </div>
  );
}
