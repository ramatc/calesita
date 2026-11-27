import Link from "next/link";
import type { ReactNode } from "react";

import { SortijaIcon } from "@/components/brand/sortija-icon";
import {
  CharacterReaction,
  CharacterReactionGroup,
} from "@/components/characters/character-reaction";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Character } from "@/types/character";

type GameResultsProps = {
  title: string;
  children: ReactNode;
  onPlayAgain: () => void;
  /** Who won, when they chose a character. Several winners celebrate together. */
  winners?: readonly Character[];
  /** Everyone tied at the top, for a draw. */
  tied?: readonly Character[];
  /** Who lost, shown small and calm under the winners. */
  losers?: readonly Character[];
};

/** A fanned hand with the sortija on top, or the winner holding it. */
function ResultsFan({ winner }: { winner?: Character }) {
  return (
    <div aria-hidden="true" className="relative h-32 w-52">
      <span className="absolute inset-y-0 left-1/2 -ml-11 w-22 -translate-x-12 -rotate-12 animate-fan-open rounded-2xl bg-brand-pink shadow-raised" />
      <span className="absolute inset-y-0 left-1/2 -ml-11 w-22 translate-x-12 rotate-12 animate-fan-open rounded-2xl bg-brand-teal shadow-raised" />
      <span
        className={cn(
          "absolute inset-y-0 left-1/2 flex items-center justify-center rounded-2xl bg-brand-yellow text-brand-ink shadow-raised",
          winner ? "-ml-14 w-28" : "-ml-11 w-22",
        )}
      >
        {winner ? (
          <CharacterReaction character={winner} reaction="victory" size="lg" />
        ) : (
          <SortijaIcon className="size-12" />
        )}
      </span>
    </div>
  );
}

export function GameResults({
  title,
  children,
  onPlayAgain,
  winners = [],
  tied = [],
  losers = [],
}: GameResultsProps) {
  const [soleWinner] = winners.length === 1 ? winners : [];

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-6 pb-4 text-center">
      <ResultsFan winner={soleWinner} />
      {winners.length > 1 && (
        <CharacterReactionGroup
          characters={winners}
          reaction="celebration"
          size="md"
          label={`Ganaron ${winners.map((character) => character.name).join(", ")}`}
        />
      )}
      {winners.length === 0 && tied.length > 0 && (
        <CharacterReactionGroup
          characters={tied}
          reaction="tie"
          size="md"
          label={`Empataron ${tied.map((character) => character.name).join(", ")}`}
        />
      )}
      <h1 className="font-display text-5xl leading-none text-brand-yellow md:text-6xl">{title}</h1>
      {losers.length > 0 && (
        <CharacterReactionGroup
          characters={losers}
          reaction="defeat"
          size="xs"
          label={`Perdieron ${losers.map((character) => character.name).join(", ")}`}
        />
      )}
      <div className="w-full text-xl">{children}</div>
      <div className="flex w-full flex-col gap-3">
        <Button variant="marquee" size="xl" onClick={onPlayAgain}>
          Jugar de nuevo
        </Button>
        <Button asChild variant="secondary" size="xl">
          <Link href="/juegos">Elegir otro juego</Link>
        </Button>
      </div>
    </div>
  );
}
