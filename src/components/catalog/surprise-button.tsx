"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { GAMES } from "@/content/catalog";
import { pickSurpriseGame } from "@/games/catalog-query";
import { playerCountStore } from "@/lib/player-count";
import { cn } from "@/lib/utils";
import type { GameSlug } from "@/types/game";

function SortijaIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn(spinning && "animate-spin-once")}
    >
      <circle cx="12" cy="14" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="m12 2 3 4-3 3-3-3Z" fill="currentColor" />
    </svg>
  );
}

export function SurpriseButton() {
  const router = useRouter();
  const [pickedSlug, setPickedSlug] = useState<GameSlug | null>(null);
  const [emptyMessage, setEmptyMessage] = useState("");

  function surprise() {
    const players = playerCountStore.get();
    const game = pickSurpriseGame(GAMES, players);

    if (game) {
      setEmptyMessage("");
      setPickedSlug(game.slug);
      return;
    }

    setEmptyMessage(
      players === null
        ? "Todavía no hay juegos listos. Ya casi."
        : `Todavía no hay juegos listos para ${players} jugadores.`,
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 md:items-start">
      <Button
        variant="secondary"
        size="xl"
        disabled={pickedSlug !== null}
        onClick={surprise}
        onAnimationEnd={() => {
          if (pickedSlug) router.push(`/jugar/${pickedSlug}`);
        }}
      >
        <SortijaIcon spinning={pickedSlug !== null} />
        Sorprendeme
      </Button>
      <p role="status" className="min-h-6 text-sm font-medium text-brand-yellow">
        {emptyMessage}
      </p>
    </div>
  );
}
