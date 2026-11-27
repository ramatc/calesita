"use client";

import { getChallenge } from "@/content/un-minuto-para-ganar";
import { ChallengeTurnsScreen } from "@/games/challenge-turns/screen";
import { reduceSession, sessionStore, SLUG } from "@/games/un-minuto-para-ganar/logic";

export default function UnMinutoParaGanarScreen() {
  return (
    <ChallengeTurnsScreen
      slug={SLUG}
      sessionStore={sessionStore}
      reduceSession={reduceSession}
      getChallenge={getChallenge}
      resultsTitle="¡Se terminó el minuto!"
      endDescription="Se termina esta partida y ven los totales. Lo que ya salió no se repite en la próxima."
    />
  );
}
