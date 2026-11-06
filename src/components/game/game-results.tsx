import Link from "next/link";
import type { ReactNode } from "react";

import { SortijaIcon } from "@/components/brand/sortija-icon";
import { Button } from "@/components/ui/button";

type GameResultsProps = {
  title: string;
  children: ReactNode;
  onPlayAgain: () => void;
};

/** A fanned hand with the sortija on top: the group caught the ring. */
function ResultsFan() {
  return (
    <div aria-hidden="true" className="relative h-32 w-52">
      <span className="absolute inset-y-0 left-1/2 -ml-11 w-22 -translate-x-12 -rotate-12 animate-fan-open rounded-2xl bg-brand-pink shadow-raised" />
      <span className="absolute inset-y-0 left-1/2 -ml-11 w-22 translate-x-12 rotate-12 animate-fan-open rounded-2xl bg-brand-teal shadow-raised" />
      <span className="absolute inset-y-0 left-1/2 -ml-11 flex w-22 items-center justify-center rounded-2xl bg-brand-yellow text-brand-ink shadow-raised">
        <SortijaIcon className="size-12" />
      </span>
    </div>
  );
}

export function GameResults({ title, children, onPlayAgain }: GameResultsProps) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-6 pb-4 text-center">
      <ResultsFan />
      <h1 className="font-display text-5xl leading-none text-brand-yellow md:text-6xl">{title}</h1>
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
