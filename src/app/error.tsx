"use client";

import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 px-5 py-16 text-center">
      <h1 className="font-display text-5xl text-brand-yellow">Se trabó la calesita</h1>
      <p className="text-lg text-muted-foreground">
        Algo salió mal. Probá de nuevo.
      </p>
      <Button size="xl" onClick={reset}>
        Reintentar
      </Button>
    </main>
  );
}
