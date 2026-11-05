import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type GameResultsProps = {
  title: string;
  children: ReactNode;
  onPlayAgain: () => void;
};

export function GameResults({ title, children, onPlayAgain }: GameResultsProps) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-6 text-center">
      <h1 className="font-display text-5xl leading-tight text-brand-yellow">{title}</h1>
      <div className="text-xl">{children}</div>
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
