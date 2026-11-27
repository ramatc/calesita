"use client";

import { PromptCard } from "@/components/game/prompt-card";
import { getSearch } from "@/content/busqueda-desesperada";
import { reduceSession, sessionStore, SLUG } from "@/games/busqueda-desesperada/logic";
import { RoundsScreen } from "@/games/rounds/screen";

export default function BusquedaDesesperadaScreen() {
  return (
    <RoundsScreen
      slug={SLUG}
      sessionStore={sessionStore}
      reduceSession={reduceSession}
      mode="players"
      roundsLabel="¿Cuántas rondas?"
      roundsOptions={[5, 8, 10]}
      defaultRounds={5}
      roundLabel="Ronda"
      renderCard={(game) => (
        <>
          <p className="text-center text-lg font-semibold text-muted-foreground">Busquen…</p>
          <PromptCard promptId={game.cardId} text={getSearch(game.cardId)?.text ?? ""} category="physical" />
        </>
      )}
      judge="one"
      judgeQuestion="¿Quién lo trajo primero?"
      resultsTitle="¡Terminó la búsqueda!"
      endDescription="Se termina esta partida y se pierde el puntaje. Lo que ya salió no se repite en la próxima."
    />
  );
}
