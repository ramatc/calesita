import { PixelLabel } from "@/components/arcade/pixel-type";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { SortijaIcon } from "@/components/brand/sortija-icon";
import {
  CharacterReaction,
  CharacterReactionGroup,
} from "@/components/characters/character-reaction";
import { Button } from "@/components/ui/button";
import { fillMessage } from "@/content/alive-messages";
import { pickMessage, pickResultReaction } from "@/lib/alive/appearance-policy";
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
      <span className="absolute inset-y-0 left-1/2 -ml-11 w-22 -translate-x-12 -rotate-12 animate-fan-open rounded-arcade-card bg-brand-pink arcade-edge" />
      <span className="absolute inset-y-0 left-1/2 -ml-11 w-22 translate-x-12 rotate-12 animate-fan-open rounded-arcade-card bg-brand-teal arcade-edge" />
      <span
        className={cn(
          "absolute inset-y-0 left-1/2 flex items-center justify-center rounded-arcade-card bg-brand-yellow text-brand-ink arcade-edge",
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
  // Chosen once per results screen, from the outcome the engine already reported.
  const [line] = useState(() => {
    const reaction = pickResultReaction({ winners, tied, losers }, Math.random);
    const character = [...winners, ...losers].find((entry) => entry.id === reaction?.characterId);
    const message = reaction && pickMessage(reaction.context, null, Math.random);
    return character && message ? fillMessage(message.text, { name: character.name }) : null;
  });

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
      <div className="flex flex-col items-center gap-2">
        <PixelLabel className="text-muted-foreground">Game over</PixelLabel>
        <h1 className="font-display text-6xl leading-[0.85] text-arcade-yellow md:text-7xl">{title}</h1>
        {line && <p className="text-lg font-semibold text-muted-foreground">{line}</p>}
      </div>
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
