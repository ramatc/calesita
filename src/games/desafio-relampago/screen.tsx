"use client";

import { getChallenge } from "@/content/desafio-relampago";
import { ChallengeTurnsScreen } from "@/games/challenge-turns/screen";
import { reduceSession, sessionStore, SLUG } from "@/games/desafio-relampago/logic";

export default function DesafioRelampagoScreen() {
  return (
    <ChallengeTurnsScreen
      slug={SLUG}
      sessionStore={sessionStore}
      reduceSession={reduceSession}
      getChallenge={getChallenge}
      resultsTitle="¡Terminó el relámpago!"
      endDescription="Se termina esta partida y ven los totales. Los desafíos que ya salieron no se repiten en la próxima."
    />
  );
}
