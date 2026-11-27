"use client";

import { useState } from "react";

import { CharacterAvatar } from "@/components/characters/character-avatar";
import { CharacterSelector } from "@/components/characters/character-selector";
import { Disclosure } from "@/components/design/disclosure";
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
  SLUG,
  type DifficultyOption,
  type Game,
} from "@/games/desafio-relampago/logic";
import { TallyBoard } from "@/games/desafio-relampago/tally-board";
import { createPlayers, type Player } from "@/games/players";
import { useGameCast } from "@/hooks/use-game-cast";
import { useGameSession } from "@/hooks/use-game-session";
import { getGameNames } from "@/lib/character-cast";
import { playerNamesStore } from "@/lib/player-names";

export default function DesafioRelampagoScreen() {
  const [session, dispatch] = useGameSession(sessionStore, reduceSession);
  const [difficulty, setDifficulty] = useState<DifficultyOption>("mixed");
  const [lastGame, setLastGame] = useState<Game | null>(null);
  const definition = getGameBySlug(SLUG);
  const { forSeat } = useGameCast(SLUG);
  const { game } = session;

  function start(players: readonly Player[], chosen: DifficultyOption) {
    setLastGame(null);
    dispatch({ type: "start", players, difficulty: chosen });
  }

  if (!definition) return null;

  if (game) {
    const challenge = getChallenge(game.challengeId);
    const player = game.players[game.turn];
    const character = forSeat(player.id);

    return (
      <GameFrame
        status={<RoundIndicator label="Desafío" current={game.played} />}
        endDescription="Se termina esta partida y ven los totales. Los desafíos que ya salieron no se repiten en la próxima."
        onEnd={() => {
          setLastGame(game);
          dispatch({ type: "end" });
        }}
      >
        <div className="flex items-center justify-center gap-3">
          {character && <CharacterAvatar character={character} size="sm" />}
          <h1 className="min-w-0 text-center font-display text-3xl">
            Le toca a <span className="text-brand-yellow">{player.name}</span>
          </h1>
        </div>
        <PromptCard
          promptId={game.challengeId}
          text={challenge?.title ?? ""}
          category={definition.category}
        />
        <p className="text-center text-lg text-balance">{challenge?.instructions}</p>
        <ChallengeControls game={game} dispatch={dispatch} />
        <Disclosure summary="Ver cómo va cada uno">
          <TallyBoard players={game.players} tallies={game.tallies} turn={game.turn} />
        </Disclosure>
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
        onStart={(players) =>
          start(
            createPlayers(players, getGameNames(SLUG, playerNamesStore.get(), players)),
            difficulty,
          )
        }
      >
        {(players) => (
          <>
            <DifficultyPicker value={difficulty} onChange={setDifficulty} />
            <CharacterSelector count={players} />
            <PlayerNamesFields count={players} />
          </>
        )}
      </GameSetup>
    </GameFrame>
  );
}
