"use client";

import { PromptCard } from "@/components/game/prompt-card";
import { getTopic } from "@/content/confesiones-anonimas";
import { reduceSession, sessionStore, SLUG } from "@/games/confesiones-anonimas/logic";
import { RoundsScreen } from "@/games/rounds/screen";

export default function ConfesionesAnonimasScreen() {
  return (
    <RoundsScreen
      slug={SLUG}
      sessionStore={sessionStore}
      reduceSession={reduceSession}
      mode="players"
      roundsLabel="¿Cuántas rondas?"
      roundsOptions={[3, 5, 7]}
      defaultRounds={3}
      roundLabel="Ronda"
      renderCard={(game) => (
        <>
          <p className="text-center text-lg font-semibold text-muted-foreground">
            Todos escriben, sin firmar:
          </p>
          <PromptCard promptId={game.cardId} text={getTopic(game.cardId)?.text ?? ""} category="social" />
          <p className="text-center text-lg text-balance">
            Mezclen los papeles, léanlos en voz alta y adivinen de quién es cada uno.
          </p>
        </>
      )}
      judge="many"
      judgeQuestion="¿Quiénes adivinaron?"
      resultsTitle="¡Se terminaron las confesiones!"
      endDescription="Se termina esta partida y se pierde el puntaje. Los temas que ya salieron no se repiten en la próxima."
    />
  );
}
