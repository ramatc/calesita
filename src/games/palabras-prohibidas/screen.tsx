"use client";

import { Ban } from "lucide-react";

import { PromptCard } from "@/components/game/prompt-card";
import { getWordCard } from "@/content/palabras-prohibidas";
import { reduceSession, sessionStore, SLUG } from "@/games/palabras-prohibidas/logic";
import { TeamTurnsScreen } from "@/games/team-turns/screen";

export function renderWordCard(promptId: string) {
  const card = getWordCard(promptId);
  return (
    <>
      <PromptCard promptId={promptId} text={card?.word ?? ""} category="classic" />
      <div className="rounded-3xl bg-card p-4 shadow-card">
        <p className="mb-2 flex items-center justify-center gap-2 font-semibold text-brand-pink">
          <Ban aria-hidden="true" className="size-5" />
          No se puede decir
        </p>
        <ul className="grid grid-cols-2 gap-2 text-center text-xl font-semibold">
          {card?.forbidden.map((word) => (
            <li key={word} className="rounded-2xl bg-secondary px-2 py-2">
              {word}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default function PalabrasProhibidasScreen() {
  return (
    <TeamTurnsScreen
      slug={SLUG}
      sessionStore={sessionStore}
      reduceSession={reduceSession}
      renderPrompt={renderWordCard}
      handoffMessage="Pasale el celular a quien va a describir. Su equipo no mira; el otro equipo puede mirar para controlar las prohibidas."
      endDescription="Se termina esta partida y se pierde el puntaje. Las palabras que ya salieron no se repiten en la próxima."
    />
  );
}
