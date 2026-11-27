"use client";

import { PromptCard } from "@/components/game/prompt-card";
import { getPrompt } from "@/content/actua-o-perdes";
import { reduceSession, sessionStore, SLUG } from "@/games/actua-o-perdes/logic";
import { TeamTurnsScreen } from "@/games/team-turns/screen";

export function renderActuaPrompt(promptId: string) {
  const prompt = getPrompt(promptId);
  return (
    <>
      <p className="text-center text-lg font-semibold text-muted-foreground">{prompt?.category}</p>
      <PromptCard promptId={promptId} text={prompt?.text ?? ""} category="classic" />
    </>
  );
}

export default function ActuaOPerdesScreen() {
  return (
    <TeamTurnsScreen
      slug={SLUG}
      sessionStore={sessionStore}
      reduceSession={reduceSession}
      renderPrompt={renderActuaPrompt}
      handoffMessage="Pasale el celular a quien va a actuar. Los demás, sin mirar la pantalla."
      endDescription="Se termina esta partida y se pierde el puntaje. Las consignas que ya salieron no se repiten en la próxima."
    />
  );
}
