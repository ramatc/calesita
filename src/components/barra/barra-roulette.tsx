"use client";

import { RotateCw } from "lucide-react";

import { CharacterAvatar } from "@/components/characters/character-avatar";
import { Button } from "@/components/ui/button";
import { useParticipants } from "@/hooks/use-participants";
import { SPIN_DURATION_MS, useRouletteSpin } from "@/hooks/use-roulette-spin";
import type { Participant } from "@/lib/participants";
import { getSegmentAngle } from "@/lib/roulette";
import { cn } from "@/lib/utils";

const GUEST_COLORS = ["#F4E9D8", "#E6DCF7", "#D7F1EE", "#FFE3EF"];

function getSegmentColor(participant: Participant, index: number) {
  return participant.kind === "character"
    ? participant.character.colors.primary
    : GUEST_COLORS[index % GUEST_COLORS.length];
}

function ParticipantBadge({ participant, size }: { participant: Participant; size: "sm" | "lg" }) {
  if (participant.kind === "character") {
    return <CharacterAvatar character={participant.character} size={size} />;
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-card font-display text-brand-ink ring-2 ring-brand-ink/20",
        size === "sm" ? "size-11 text-xl" : "size-24 text-5xl",
      )}
    >
      {participant.name.charAt(0).toUpperCase()}
    </span>
  );
}

/** A wheel with exactly the people present. Hidden until someone is on the barra. */
export function BarraRoulette() {
  const { participants } = useParticipants();
  const count = participants.length;
  const wheelKey = participants.map((participant) => participant.id).join("|");
  const { rotation, animate, spinning, winner, spin, onSpinEnd } = useRouletteSpin(
    count,
    wheelKey,
  );

  if (count === 0) {
    return (
      <p className="rounded-2xl bg-secondary px-4 py-3 text-muted-foreground">
        Marcá quién está o sumá invitados para usar la ruleta. Para jugar no hace falta.
      </p>
    );
  }

  const segment = getSegmentAngle(count);
  const gradient =
    count === 1
      ? getSegmentColor(participants[0], 0)
      : `conic-gradient(${participants
          .map(
            (participant, index) =>
              `${getSegmentColor(participant, index)} ${index * segment}deg ${(index + 1) * segment}deg`,
          )
          .join(", ")})`;
  const chosen = winner === null ? null : participants[winner];

  return (
    <div className="flex flex-col items-center gap-5 md:flex-row md:items-center md:gap-10">
      <div className="relative w-full max-w-[min(20rem,100%)] shrink-0">
        <span
          aria-hidden="true"
          className="absolute -top-1 left-1/2 z-10 size-0 -translate-x-1/2 border-x-[12px] border-t-[20px] border-x-transparent border-t-brand-ink drop-shadow"
        />
        <div
          aria-hidden="true"
          className="relative aspect-square w-full rounded-full shadow-card ring-4 ring-card"
          style={{
            background: gradient,
            transform: `rotate(${rotation}deg)`,
            transition: animate
              ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.15, 0.85, 0.2, 1)`
              : "none",
          }}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget) onSpinEnd();
          }}
        >
          {participants.map((participant, index) => (
            <span
              key={participant.id}
              className="absolute inset-0 flex justify-center pt-[6%]"
              style={{ transform: `rotate(${(index + 0.5) * segment}deg)` }}
            >
              {count <= 12 ? (
                <ParticipantBadge participant={participant} size="sm" />
              ) : (
                <span className="font-display text-sm text-brand-ink">
                  {participant.name.charAt(0)}
                </span>
              )}
            </span>
          ))}
          <span className="absolute inset-[38%] rounded-full bg-card shadow-card" />
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-4 text-center md:items-start md:text-left">
        <div aria-live="polite" className="flex min-h-28 items-center gap-4">
          {chosen ? (
            <>
              <span className="motion-safe:animate-in motion-safe:zoom-in-75 motion-safe:fade-in">
                <ParticipantBadge participant={chosen} size="lg" />
              </span>
              <p className="text-lg">
                Le toca a
                <strong className="block font-display text-4xl">{chosen.name}</strong>
              </p>
            </>
          ) : (
            <p className="text-lg text-muted-foreground">
              {spinning
                ? "Girando…"
                : count === 1
                  ? "Hay una sola persona en la ruleta. Sumá a alguien más."
                  : `${count} en la ruleta, todos con la misma chance.`}
            </p>
          )}
        </div>
        <Button variant="marquee" size="xl" disabled={spinning} onClick={spin}>
          <RotateCw />
          {chosen ? "Girar de nuevo" : "Girar la ruleta"}
        </Button>
      </div>
    </div>
  );
}
