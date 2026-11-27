"use client";

import { getChallenge } from "@/content/estatuas-imposibles";
import { ChallengeTurnsScreen } from "@/games/challenge-turns/screen";
import { reduceSession, sessionStore, SLUG } from "@/games/estatuas-imposibles/logic";

export default function EstatuasImposiblesScreen() {
  return (
    <ChallengeTurnsScreen
      slug={SLUG}
      sessionStore={sessionStore}
      reduceSession={reduceSession}
      getChallenge={getChallenge}
      resultsTitle="¡Se terminaron las estatuas!"
      endDescription="Se termina esta partida y ven los totales. Lo que ya salió no se repite en la próxima."
    />
  );
}
