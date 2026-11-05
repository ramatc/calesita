"use client";

import { useState } from "react";

import { GameFrame } from "@/components/game/game-frame";
import { GameResults } from "@/components/game/game-results";
import { GameSetup } from "@/components/game/game-setup";
import { PlayerNamesFields } from "@/components/game/player-names-fields";
import { PromptCard } from "@/components/game/prompt-card";
import { RoundIndicator } from "@/components/game/round-indicator";
import { getGameBySlug } from "@/content/catalog";
import { getChallenge } from "@/content/desafio-relampago";
import { ChallengeControls } from "@/games/desafio-relampago/challenge-controls";
import { DifficultyPicker } from "@/games/desafio-relampago/difficulty-picker";
import {
  getTotals,
  reduceSession,
  sessionStore,
  type DifficultyOption,
  type Game,
} from "@/games/desafio-relampago/logic";
import { TallyBoard } from "@/games/desafio-relampago/tally-board";
import { createPlayers, type Player } from "@/games/players";
import { useGameSession } from "@/hooks/use-game-session";
import { playerNamesStore } from "@/lib/player-names";

export default function DesafioRelampagoScreen() {
  const [session, dispatch] = useGameSession(sessionStore, reduceSession);
  const [difficulty, setDifficulty] = useState<DifficultyOption>("mixed");
  const [lastGame, setLastGame] = useState<Game | null>(null);
  const definition = getGameBySlug("desafio-relampago");
  const { game } = session;

  function start(players: readonly Player[], chosen: DifficultyOption) {
    setLastGame(null);
    dispatch({ type: "start", players, difficulty: chosen });
  }

  if (!definition) return null;

  if (game) {
    const challenge = getChallenge(game.challengeId);

    return (
      <GameFrame
        status={<RoundIndicator label="Desafío" current={game.played} />}
        endDescription="Se termina esta partida y ven los totales. Los desafíos que ya salieron no se repiten en la próxima."
        onEnd={() => {
          setLastGame(game);
          dispatch({ type: "end" });
        }}
      >
        <h1 className="text-center text-2xl font-bold">
          Le toca a <span className="text-brand-yellow">{game.players[game.turn].name}</span>
        </h1>
        <PromptCard
          promptId={game.challengeId}
          text={challenge?.title ?? ""}
          category={definition.category}
        />
        <p className="text-center text-lg text-balance">{challenge?.instructions}</p>
        <ChallengeControls game={game} dispatch={dispatch} />
        <details>
          <summary className="flex min-h-11 cursor-pointer items-center justify-center font-semibold">
            Ver cómo va cada uno
          </summary>
          <div className="mt-2">
            <TallyBoard players={game.players} tallies={game.tallies} turn={game.turn} />
          </div>
        </details>
      </GameFrame>
    );
  }

  if (lastGame) {
    const totals = getTotals(lastGame.tallies);

    return (
      <GameFrame>
        <GameResults
          title="¡Terminó el relámpago!"
          onPlayAgain={() => start(lastGame.players, lastGame.difficulty)}
        >
          <p>
            Completados: {totals.completed} · Fallidos: {totals.failed} · Saltados: {totals.skipped}
          </p>
          <div className="mt-4 w-80 max-w-[calc(100vw-2rem)] text-left">
            <TallyBoard players={lastGame.players} tallies={lastGame.tallies} />
          </div>
        </GameResults>
      </GameFrame>
    );
  }

  return (
    <GameFrame>
      <GameSetup
        game={definition}
        onStart={(players) => start(createPlayers(players, playerNamesStore.get()), difficulty)}
      >
        {(players) => (
          <>
            <DifficultyPicker value={difficulty} onChange={setDifficulty} />
            <PlayerNamesFields count={players} />
          </>
        )}
      </GameSetup>
    </GameFrame>
  );
}
