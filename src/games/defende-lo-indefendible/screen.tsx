"use client";

import { getChallenge } from "@/content/defende-lo-indefendible";
import { ChallengeTurnsScreen } from "@/games/challenge-turns/screen";
import { reduceSession, sessionStore, SLUG } from "@/games/defende-lo-indefendible/logic";

export default function DefendeLoIndefendibleScreen() {
  return (
    <ChallengeTurnsScreen
      slug={SLUG}
      sessionStore={sessionStore}
      reduceSession={reduceSession}
      getChallenge={getChallenge}
      resultsTitle="¡Se cerró el debate!"
      endDescription="Se termina esta partida y ven los totales. Lo que ya salió no se repite en la próxima."
      wording={{
        turn: "Postura",
        completed: "Convenció",
        failed: "No convenció",
        completedPlural: "Convencieron",
        failedPlural: "No convencieron",
      }}
    />
  );
}
