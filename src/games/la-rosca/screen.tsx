"use client";

import { Check, Play, SkipForward, X } from "lucide-react";
import { useState } from "react";

import { CharacterSelector } from "@/components/characters/character-selector";
import { GameFrame } from "@/components/game/game-frame";
import { GameResults } from "@/components/game/game-results";
import { GameSetup } from "@/components/game/game-setup";
import { GameTimer } from "@/components/game/game-timer";
import { Scoreboard } from "@/components/game/scoreboard";
import { TeamNamesFields } from "@/components/game/team-names-fields";
import { Button } from "@/components/ui/button";
import { getGameBySlug } from "@/content/catalog";
import { getRosco, LETTERS } from "@/content/la-rosca";
import {
  countStatus,
  getWinnerIndex,
  reduceSession,
  sessionStore,
  SLUG,
  type Action,
  type Game,
  type RoscaTeam,
} from "@/games/la-rosca/logic";
import { createPlayers } from "@/games/players";
import { useGameCast } from "@/hooks/use-game-cast";
import { useGameSession } from "@/hooks/use-game-session";
import { useMatchRecording } from "@/hooks/use-match-recording";
import { getGameSeatIdentities } from "@/lib/character-cast";
import { scoredTeamsResult } from "@/lib/match-result";
import { formatClock } from "@/lib/timer";
import { cn } from "@/lib/utils";

const TEAMS_HINT = "Los números impares van a un equipo y los pares al otro.";

export function toMatchDraft(game: Game) {
  return scoredTeamsResult(
    SLUG,
    game.teams.map((team) => ({
      id: team.id,
      name: team.name,
      seatIds: [...team.playerIds],
      score: countStatus(team, "correct"),
    })),
    getGameSeatIdentities(SLUG, createPlayers(game.players)),
  );
}

const STATUS_STYLE = {
  pending: "bg-primary text-primary-foreground",
  correct: "bg-brand-teal text-brand-ink",
  wrong: "bg-brand-pink text-brand-ink",
} as const;

/** The 25 letters laid out in a ring, with the current one lifted. */
function RoscoRing({ team, active }: { team: RoscaTeam; active: boolean }) {
  const radius = 42;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-80" role="list" aria-label={`Rosca de ${team.name}`}>
      {LETTERS.map((letter, index) => {
        const angle = (index / LETTERS.length) * 2 * Math.PI - Math.PI / 2;
        const current = active && index === team.cursor;
        return (
          <span
            key={letter}
            role="listitem"
            aria-label={`${letter}: ${team.statuses[index] === "correct" ? "acierto" : team.statuses[index] === "wrong" ? "error" : "pendiente"}`}
            className={cn(
              "absolute flex size-[11%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-display text-sm arcade-edge md:text-base",
              STATUS_STYLE[team.statuses[index]],
              current && "scale-125 bg-brand-yellow text-brand-ink",
            )}
            style={{ left: `${50 + radius * Math.cos(angle)}%`, top: `${50 + radius * Math.sin(angle)}%` }}
          >
            {letter}
          </span>
        );
      })}
      <div className="absolute inset-[22%] flex flex-col items-center justify-center text-center">
        <span className="font-display text-5xl text-brand-yellow" data-tabular>
          {countStatus(team, "correct")}
        </span>
        <span className="text-sm font-semibold text-muted-foreground">aciertos</span>
      </div>
    </div>
  );
}

function TeamsBoard({ game, highlightedId }: { game: Game; highlightedId?: string }) {
  const { forSeats } = useGameCast(SLUG);
  return (
    <Scoreboard
      label="Aciertos"
      entries={game.teams.map((team) => ({
        id: team.id,
        name: `${team.name} · ${countStatus(team, "wrong")} errores · ${formatClock(team.timer.remainingMs)}`,
        characters: forSeats(team.playerIds),
        value: countStatus(team, "correct"),
        highlighted: team.id === highlightedId,
      }))}
    />
  );
}

function HandoffView({ game, dispatch }: { game: Game; dispatch: (action: Action) => void }) {
  const team = game.teams[game.turnIndex];
  const rival = game.teams[game.turnIndex === 0 ? 1 : 0];
  return (
    <div className="flex flex-1 flex-col gap-6">
      <RoscoRing team={team} active={false} />
      <div className="text-center">
        <h2 className="font-display text-4xl text-brand-yellow">Le toca a {team.name}</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Alguien de {rival.name} agarra el celular y lee las definiciones. Quedan{" "}
          {formatClock(team.timer.remainingMs)}.
        </p>
      </div>
      <TeamsBoard game={game} />
      <Button
        variant="marquee"
        size="xl"
        className="sticky bottom-3 mt-auto w-full"
        onClick={() => dispatch({ type: "begin-turn", now: Date.now() })}
      >
        <Play className="fill-current" />
        Arrancar el reloj
      </Button>
    </div>
  );
}

function PlayingView({ game, dispatch }: { game: Game; dispatch: (action: Action) => void }) {
  const team = game.teams[game.turnIndex];
  const clue = getRosco(team.roscoId)?.clues[team.cursor];
  const isRunning = team.timer.deadlineMs !== null;
  const send = (result: "correct" | "wrong" | "pass") =>
    dispatch({ type: "answer", result, now: Date.now() });

  return (
    <div className="flex flex-1 flex-col gap-5">
      <GameTimer
        timer={team.timer}
        onPause={() => dispatch({ type: "pause", now: Date.now() })}
        onResume={() => dispatch({ type: "resume", now: Date.now() })}
        onExpire={() => dispatch({ type: "expire", now: Date.now() })}
      />
      <RoscoRing team={team} active />
      {clue && (
        <section aria-live="polite" className="rounded-arcade-panel bg-card p-5 arcade-edge">
          <p className="font-semibold text-muted-foreground">
            {clue.kind === "starts" ? "Empieza con" : "Contiene la"}{" "}
            <strong className="font-display text-2xl text-brand-yellow">{clue.letter}</strong>
          </p>
          <p className="mt-2 text-2xl font-semibold">{clue.definition}</p>
          <p className="mt-3 text-muted-foreground">
            Respuesta: <strong className="text-foreground">{clue.answer}</strong>
          </p>
        </section>
      )}
      <div className="sticky bottom-3 mt-auto grid grid-cols-3 gap-3">
        <Button variant="marquee" size="xl" disabled={!isRunning} onClick={() => send("correct")}>
          <Check />
          Bien
        </Button>
        <Button variant="secondary" size="xl" disabled={!isRunning} onClick={() => send("wrong")}>
          <X />
          Mal
        </Button>
        <Button variant="secondary" size="xl" disabled={!isRunning} onClick={() => send("pass")}>
          <SkipForward />
          Pasapalabra
        </Button>
      </div>
    </div>
  );
}

function FinalResults({ game, dispatch }: { game: Game; dispatch: (action: Action) => void }) {
  const { forSeats } = useGameCast(SLUG);
  const winnerIndex = getWinnerIndex(game);
  const winner = winnerIndex === null ? undefined : game.teams[winnerIndex];
  const loser = winnerIndex === null ? undefined : game.teams[winnerIndex === 0 ? 1 : 0];

  return (
    <GameResults
      title={winner ? `¡Ganó ${winner.name}!` : "¡Empate!"}
      winners={winner ? forSeats(winner.playerIds) : []}
      losers={loser ? forSeats(loser.playerIds) : []}
      tied={winner ? [] : forSeats(game.teams.flatMap((team) => team.playerIds))}
      onPlayAgain={() => dispatch({ type: "play-again" })}
    >
      <div className="flex flex-col gap-3">
        <TeamsBoard game={game} highlightedId={winner?.id} />
        <Button variant="ghost" size="xl" className="w-full" onClick={() => dispatch({ type: "end" })}>
          Cambiar equipos
        </Button>
      </div>
    </GameResults>
  );
}

export default function LaRoscaScreen() {
  const [session, dispatch] = useGameSession(sessionStore, reduceSession);
  const [teamNames, setTeamNames] = useState<string[]>([]);
  const definition = getGameBySlug(SLUG);
  const { game } = session;

  useMatchRecording(
    SLUG,
    game?.phase === "finished" ? "finished" : game ? "playing" : "idle",
    () => game && toMatchDraft(game),
  );

  if (!definition) return null;

  if (game?.phase === "finished") {
    return (
      <GameFrame>
        <FinalResults game={game} dispatch={dispatch} />
      </GameFrame>
    );
  }

  if (game) {
    return (
      <GameFrame
        status={<span className="font-semibold">{game.teams[game.turnIndex].name}</span>}
        endDescription="Se termina esta partida sin ganador."
        onEnd={() => dispatch({ type: "end" })}
      >
        {game.phase === "handoff" ? (
          <HandoffView game={game} dispatch={dispatch} />
        ) : (
          <PlayingView game={game} dispatch={dispatch} />
        )}
      </GameFrame>
    );
  }

  return (
    <GameFrame>
      <GameSetup
        game={definition}
        onStart={(players) => dispatch({ type: "start", players, teamNames })}
      >
        {(players) => (
          <>
            <TeamNamesFields names={teamNames} onChange={setTeamNames} />
            <CharacterSelector count={players} hint={TEAMS_HINT} />
          </>
        )}
      </GameSetup>
    </GameFrame>
  );
}
