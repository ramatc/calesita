"use client";

import { getChallenge } from "@/content/mentira-o-verdad";
import { ChallengeTurnsScreen } from "@/games/challenge-turns/screen";
import { reduceSession, sessionStore, SLUG } from "@/games/mentira-o-verdad/logic";

export default function MentiraOVerdadScreen() {
  return (
    <ChallengeTurnsScreen
      slug={SLUG}
      sessionStore={sessionStore}
      reduceSession={reduceSession}
      getChallenge={getChallenge}
      resultsTitle="¡Se terminaron las historias!"
      endDescription="Se termina esta partida y ven los totales. Lo que ya salió no se repite en la próxima."
      wording={{
        turn: "Historia",
        completed: "Engañó",
        failed: "Descubierto",
        completedPlural: "Engaños",
        failedPlural: "Descubiertos",
      }}
      showDifficulty={false}
    />
  );
}
