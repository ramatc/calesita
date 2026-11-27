"use client";

import { useState, type ReactNode } from "react";

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
  type Action,
  type Game,
  type Session,
} from "@/games/team-turns/logic";
import {
  ActingView,
  HandoffView,
  Scores,
  SummaryView,
} from "@/games/team-turns/play-views";
import { SetupOptions, type SetupValues } from "@/games/team-turns/setup-options";
import { createPlayers, getLeaders } from "@/games/players";
import { useGameCast } from "@/hooks/use-game-cast";
import { useGameSession } from "@/hooks/use-game-session";
import { useMatchRecording } from "@/hooks/use-match-recording";
import { getGameSeatIdentities } from "@/lib/character-cast";
import { scoredTeamsResult } from "@/lib/match-result";
import type { PersistentStore } from "@/lib/storage";
import type { GameSlug } from "@/types/game";

type TeamTurnsScreenProps = {
  slug: GameSlug;
  sessionStore: PersistentStore<Session>;
  reduceSession: (session: Session, action: Action) => Session;
  renderPrompt: (promptId: string) => ReactNode;
  handoffMessage: string;
  endDescription: string;
};

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

export function toMatchDraft(slug: string, game: Game) {
  return scoredTeamsResult(
    slug,
    game.teams.map((team) => ({
      id: team.id,
      name: team.name,
      seatIds: [...team.playerIds],
      score: team.score,
    })),
    getGameSeatIdentities(slug, createPlayers(game.players)),
  );
}

/** The shared screen of every two-team, timed-turn game. */
export function TeamTurnsScreen({
  slug: SLUG,
  sessionStore,
  reduceSession,
  renderPrompt,
  handoffMessage,
  endDescription,
}: TeamTurnsScreenProps) {
  const [session, dispatch] = useGameSession(sessionStore, reduceSession);
  const [setup, setSetup] = useState(INITIAL_SETUP);
  const [endedGame, setEndedGame] = useState<Game | null>(null);
  const definition = getGameBySlug(SLUG);
  const { forSeats } = useGameCast(SLUG);
  const { game } = session;

  useMatchRecording(
    SLUG,
    game?.phase === "finished" ? "finished" : game ? "playing" : "idle",
    () => game && toMatchDraft(SLUG, game),
  );

  function start(players: number, values: SetupValues) {
    setEndedGame(null);
    dispatch({ type: "start", players, ...values });
  }

  function getWinners({ teams }: Game) {
    const leaders = getLeaders(teams);
    return leaders.length === 1 ? forSeats(leaders[0].playerIds) : [];
  }

  function getLosers({ teams }: Game) {
    const leaders = getLeaders(teams);
    if (leaders.length !== 1) return [];
    return forSeats(teams.filter((team) => team.id !== leaders[0].id).flatMap((team) => team.playerIds));
  }

  function getTied({ teams }: Game) {
    const leaders = getLeaders(teams);
    return leaders.length > 1 ? forSeats(leaders.flatMap((team) => team.playerIds)) : [];
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
          tied={getTied(game)}
          losers={getLosers(game)}
          onPlayAgain={() => playAgain(game)}
        >
          <div className="flex flex-col gap-3">
            <Scores
              slug={SLUG}
              teams={game.teams}
              highlightedId={getLeaders(game.teams).length === 1 ? getLeaders(game.teams)[0].id : undefined}
            />
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
        endDescription={endDescription}
        onEnd={() => {
          setEndedGame(game);
          dispatch({ type: "end" });
        }}
      >
        {game.phase === "handoff" && (
          <HandoffView
            slug={SLUG}
            game={game}
            message={handoffMessage}
            onBeginTurn={() => dispatch({ type: "begin-turn", now: Date.now() })}
          />
        )}
        {game.phase === "acting" && (
          <ActingView
            game={game}
            surface={definition.category}
            renderPrompt={renderPrompt}
            onHit={() => dispatch({ type: "hit", now: Date.now() })}
            onPass={() => dispatch({ type: "pass", now: Date.now() })}
            onPause={() => dispatch({ type: "pause", now: Date.now() })}
            onResume={() => dispatch({ type: "resume", now: Date.now() })}
            onExpire={() => dispatch({ type: "expire", now: Date.now() })}
          />
        )}
        {game.phase === "summary" && (
          <SummaryView slug={SLUG} game={game} onNext={() => dispatch({ type: "next-turn" })} />
        )}
      </GameFrame>
    );
  }

  if (endedGame) {
    return (
      <GameFrame>
        <GameResults title="Partida terminada" onPlayAgain={() => playAgain(endedGame)}>
          {endedGame.teams.some((team) => team.score > 0) ? (
            <Scores slug={SLUG} teams={endedGame.teams} />
          ) : (
            <p className="text-lg text-muted-foreground">Nadie llegó a sumar puntos.</p>
          )}
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
