import { X } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { ConfirmDialog } from "@/components/game/confirm-dialog";
import { Button } from "@/components/ui/button";

type GameFrameProps = {
  children: ReactNode;
  /** Shown in the top bar during a game. */
  status?: ReactNode;
  /** Present while a game is running; ending it asks for confirmation first. */
  onEnd?: () => void;
  /** What ending means for this game, shown in the confirmation. */
  endDescription?: string;
};

/** Full-height layout for playing: one top bar, then content, then bottom-aligned controls. */
export function GameFrame({ children, status, onEnd, endDescription = "" }: GameFrameProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-4 p-4">
      <div className="flex min-h-11 items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {status ?? (
            <Link href="/" aria-label="Calesita, ir al inicio" className="rounded-lg">
              <Logo className="text-2xl" />
            </Link>
          )}
        </div>
        {onEnd ? (
          <ConfirmDialog
            trigger={
              <Button variant="secondary" size="chip">
                <X />
                Terminar
              </Button>
            }
            title="¿Terminar la partida?"
            description={endDescription}
            confirmLabel="Terminar"
            onConfirm={onEnd}
          />
        ) : (
          <Button asChild variant="ghost" size="touch" aria-label="Volver a los juegos">
            <Link href="/juegos">
              <X />
            </Link>
          </Button>
        )}
      </div>
      {children}
    </main>
  );
}
