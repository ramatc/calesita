"use client";

import { useState } from "react";

import { CharacterSelector } from "@/components/characters/character-selector";
import { GameFrame } from "@/components/game/game-frame";
import { GameResults } from "@/components/game/game-results";
import { GameSetup } from "@/components/game/game-setup";
import { RoundIndicator } from "@/components/game/round-indicator";
import { Button } from "@/components/ui/button";
import { getGameBySlug } from "@/content/catalog";
import {
  DEFAULT_ROUNDS,
  DEFAULT_TURN_SECONDS,
  reduceSession,
  sessionStore,
  SLUG,
  type Game,
} from "@/games/actua-o-perdes/logic";
import {
  ActingView,
  HandoffView,
  Scores,
  SummaryView,
} from "@/games/actua-o-perdes/play-views";
import { SetupOptions, type SetupValues } from "@/games/actua-o-perdes/setup-options";
import { getLeaders } from "@/games/players";
import { useGameCast } from "@/hooks/use-game-cast";
import { useGameSession } from "@/hooks/use-game-session";

const TEAMS_HINT = "Los números impares van a un equipo y los pares al otro.";

const INITIAL_SETUP: SetupValues = {
  teamNames: [],
  turnSeconds: DEFAULT_TURN_SECONDS,
  rounds: DEFAULT_ROUNDS,
};

function getResultTitle(game: Game) {
  const leaders = getLeaders(game.teams);
  return leaders.length > 1 ? "¡Empate!" : `¡Ganó ${leaders[0].name}!`;
}

export default function ActuaOPerdesScreen() {
  const [session, dispatch] = useGameSession(sessionStore, reduceSession);
  const [setup, setSetup] = useState(INITIAL_SETUP);
  const [endedGame, setEndedGame] = useState<Game | null>(null);
  const definition = getGameBySlug(SLUG);
  const { forSeats } = useGameCast(SLUG);
  const { game } = session;

  function start(players: number, values: SetupValues) {
    setEndedGame(null);
    dispatch({ type: "start", players, ...values });
  }

  function getWinners({ teams }: Game) {
    const leaders = getLeaders(teams);
    return leaders.length === 1 ? forSeats(leaders[0].playerIds) : [];
  }

  function playAgain({ players, teams, turnSeconds, totalRounds }: Game) {
    start(players, {
      teamNames: teams.map((team) => team.name),
      turnSeconds,
      rounds: totalRounds,
    });
  }

  if (!definition) return null;

  if (game?.phase === "finished") {
    return (
      <GameFrame>
        <GameResults
          title={getResultTitle(game)}
          winners={getWinners(game)}
          onPlayAgain={() => playAgain(game)}
        >
          <div className="flex flex-col gap-3">
            <Scores teams={game.teams} />
            <Button
              variant="ghost"
              size="xl"
              className="w-full"
              onClick={() => dispatch({ type: "end" })}
            >
              Cambiar equipos y tiempos
            </Button>
          </div>
        </GameResults>
      </GameFrame>
    );
  }

  if (game) {
    return (
      <GameFrame
        status={<RoundIndicator label="Ronda" current={game.round} total={game.totalRounds} />}
        endDescription="Se termina esta partida y se pierde el puntaje. Las consignas que ya salieron no se repiten en la próxima."
        onEnd={() => {
          setEndedGame(game);
          dispatch({ type: "end" });
        }}
      >
        {game.phase === "handoff" && (
          <HandoffView
            game={game}
            onBeginTurn={() => dispatch({ type: "begin-turn", now: Date.now() })}
          />
        )}
        {game.phase === "acting" && (
          <ActingView
            game={game}
            surface={definition.category}
            onHit={() => dispatch({ type: "hit", now: Date.now() })}
            onPass={() => dispatch({ type: "pass", now: Date.now() })}
            onPause={() => dispatch({ type: "pause", now: Date.now() })}
            onResume={() => dispatch({ type: "resume", now: Date.now() })}
            onExpire={() => dispatch({ type: "expire", now: Date.now() })}
          />
        )}
        {game.phase === "summary" && (
          <SummaryView game={game} onNext={() => dispatch({ type: "next-turn" })} />
        )}
      </GameFrame>
    );
  }

  if (endedGame) {
    return (
      <GameFrame>
        <GameResults title="Partida terminada" onPlayAgain={() => playAgain(endedGame)}>
          <Scores teams={endedGame.teams} />
        </GameResults>
      </GameFrame>
    );
  }

  return (
    <GameFrame>
      <GameSetup game={definition} onStart={(players) => start(players, setup)}>
        {(players) => (
          <>
            <SetupOptions values={setup} onChange={setSetup} />
            <CharacterSelector count={players} hint={TEAMS_HINT} />
          </>
        )}
      </GameSetup>
    </GameFrame>
  );
}
