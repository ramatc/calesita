"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useRef, type ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { ConfirmDialog } from "@/components/game/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useFocusRecovery } from "@/hooks/use-focus-recovery";

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
  const rootRef = useRef<HTMLElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useFocusRecovery(rootRef, statusRef, contentRef, status ? "playing" : "static");

  return (
    <main ref={rootRef} className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-4 p-4">
      <div className="flex min-h-11 items-center justify-between gap-3">
        <div ref={statusRef} className="min-w-0 flex-1 rounded-full">
          {status ?? (
            <Link
              href="/"
              aria-label="Calesita, ir al inicio"
              className="inline-flex min-h-11 items-center rounded-lg"
            >
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
      {/* Layout-neutral, so the frame's flex gaps still apply to each child. */}
      <div ref={contentRef} className="contents">
        {children}
      </div>
    </main>
  );
}
