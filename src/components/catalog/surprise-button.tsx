"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { SortijaIcon } from "@/components/brand/sortija-icon";
import { Button } from "@/components/ui/button";
import { GAMES } from "@/content/catalog";
import { pickSurpriseGame } from "@/games/catalog-query";
import { playerCountStore } from "@/lib/player-count";
import { cn } from "@/lib/utils";
import type { GameSlug } from "@/types/game";

type SurpriseButtonProps = {
  className?: string;
  /** Navbar form: the primary color, with the empty message floating under it. */
  compact?: boolean;
};

export function SurpriseButton({ className, compact = false }: SurpriseButtonProps) {
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
    <div className={cn(compact ? "relative" : "flex flex-col gap-2", className)}>
      <Button
        variant={compact ? "marquee" : "secondary"}
        size={compact ? "chip" : "xl"}
        disabled={pickedSlug !== null}
        className={compact ? "w-full font-semibold" : "w-full sm:w-auto"}
        onClick={surprise}
        onAnimationEnd={() => {
          if (pickedSlug) router.push(`/jugar/${pickedSlug}`);
        }}
      >
        <SortijaIcon className={cn(pickedSlug !== null && "animate-spin-once")} />
        Sorprendeme
      </Button>
      <p
        role="status"
        className={cn(
          "text-sm font-medium text-brand-yellow",
          compact
            ? "absolute top-full right-0 mt-3 w-max max-w-60 rounded-xl bg-popover px-3 py-2 shadow-raised empty:hidden"
            : "min-h-5 text-center sm:text-left",
        )}
      >
        {emptyMessage}
      </p>
    </div>
  );
}
