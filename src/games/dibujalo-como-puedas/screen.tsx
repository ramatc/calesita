"use client";

import { PromptCard } from "@/components/game/prompt-card";
import { getDrawing } from "@/content/dibujalo-como-puedas";
import { reduceSession, sessionStore, SLUG } from "@/games/dibujalo-como-puedas/logic";
import { TeamTurnsScreen } from "@/games/team-turns/screen";

export function renderDrawing(promptId: string) {
  const drawing = getDrawing(promptId);
  return (
    <>
      <p className="text-center text-lg font-semibold text-muted-foreground">{drawing?.category}</p>
      <PromptCard promptId={promptId} text={drawing?.text ?? ""} category="classic" />
    </>
  );
}

export default function DibujaloComoPuedasScreen() {
  return (
    <TeamTurnsScreen
      slug={SLUG}
      sessionStore={sessionStore}
      reduceSession={reduceSession}
      renderPrompt={renderDrawing}
      handoffMessage="Pasale el celular y el papel a quien va a dibujar. Los demás, sin mirar la pantalla."
      endDescription="Se termina esta partida y se pierde el puntaje. Las consignas que ya salieron no se repiten en la próxima."
    />
  );
}
