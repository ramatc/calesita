"use client";

import { PromptCard } from "@/components/game/prompt-card";
import { getEvent } from "@/content/olimpiadas-calesita";
import { reduceSession, sessionStore, SLUG } from "@/games/olimpiadas-calesita/logic";
import { RoundsScreen } from "@/games/rounds/screen";

export default function OlimpiadasCalesitaScreen() {
  return (
    <RoundsScreen
      slug={SLUG}
      sessionStore={sessionStore}
      reduceSession={reduceSession}
      mode="teams"
      roundsLabel="¿Cuántas pruebas?"
      roundsOptions={[3, 5, 7]}
      defaultRounds={5}
      roundLabel="Prueba"
      renderCard={(game) => {
        const event = getEvent(game.cardId);
        return (
          <>
            <PromptCard promptId={game.cardId} text={event?.title ?? ""} category="physical" />
            <p className="text-center text-lg text-balance">{event?.instructions}</p>
          </>
        );
      }}
      judge="one"
      judgeQuestion="¿Qué equipo ganó la prueba?"
      resultsTitle="¡Terminaron las Olimpiadas!"
      endDescription="Se termina esta partida y se pierde el puntaje. Las pruebas que ya salieron no se repiten en la próxima."
    />
  );
}
