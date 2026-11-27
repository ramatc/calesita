"use client";

import { BarraRoulette } from "@/components/barra/barra-roulette";
import { GuestList } from "@/components/barra/guest-list";
import { CharacterLineup } from "@/components/characters/character-lineup";
import { Button } from "@/components/ui/button";
import { useParticipants } from "@/hooks/use-participants";
import { barra } from "@/lib/participants";

/** Who is here tonight: characters, guests, and the wheel to pick among them. */
export function LaBarra() {
  const { participants } = useParticipants();
  const count = participants.length;

  return (
    <div className="flex flex-col gap-8">
      <CharacterLineup />

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p role="status" className="font-semibold">
            {count === 0
              ? "Nadie marcado todavía."
              : count === 1
                ? "1 presente."
                : `${count} presentes. Los juegos arrancan con ${count} jugadores.`}
          </p>
          {count > 0 && (
            <Button variant="ghost" size="chip" onClick={barra.clear}>
              Vaciar la barra
            </Button>
          )}
        </div>
        <GuestList />
      </div>

      <section aria-labelledby="roulette-heading" className="flex flex-col gap-4">
        <h3 id="roulette-heading" className="font-display text-2xl">
          La ruleta de la barra
        </h3>
        <BarraRoulette />
      </section>
    </div>
  );
}
