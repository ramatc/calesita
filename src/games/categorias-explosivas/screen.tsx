"use client";

import { Check, Play, Shuffle, X } from "lucide-react";
import { useState } from "react";

import { CharacterAvatar } from "@/components/characters/character-avatar";
import { CharacterSelector } from "@/components/characters/character-selector";
import { OptionGroup } from "@/components/design/option-group";
import { GameFrame } from "@/components/game/game-frame";
import { GameResults } from "@/components/game/game-results";
import { GameSetup } from "@/components/game/game-setup";
import { GameTimer } from "@/components/game/game-timer";
import { PlayerNamesFields } from "@/components/game/player-names-fields";
import { PromptCard } from "@/components/game/prompt-card";
import { RoundIndicator } from "@/components/game/round-indicator";
import { Button } from "@/components/ui/button";
import { getGameBySlug } from "@/content/catalog";
import { getCategoryText } from "@/content/categorias-explosivas";
import { formatLives, LivesBoard, LivesHearts } from "@/games/categorias-explosivas/lives";
import {
  DEFAULT_LIVES,
  DEFAULT_SECONDS,
  getNextPlayer,
  getWinner,
  LIVES_OPTIONS,
  reduceSession,
  SECONDS_OPTIONS,
  sessionStore,
  SLUG,
  type Action,
  type Game,
  type LivesOption,
  type LossReason,
  type SecondsOption,
} from "@/games/categorias-explosivas/logic";
import { createPlayers } from "@/games/players";
import { useGameCast } from "@/hooks/use-game-cast";
import { useGameSession } from "@/hooks/use-game-session";
import { getGameNames } from "@/lib/character-cast";
import { playerNamesStore } from "@/lib/player-names";

const LOSS_MESSAGES: Record<LossReason, string> = {
  mistake: "Repitió o se equivocó.",
  timeout: "Se acabó el tiempo.",
};

function TurnLine({ game }: { game: Game }) {
  const player = game.players[game.currentIndex];
  const character = useGameCast(SLUG).forSeat(player.id);

  return (
    <p aria-live="polite" className="flex items-center justify-center gap-3 text-2xl font-bold">
      {character && <CharacterAvatar character={character} size="sm" />}
      <span className="min-w-0 truncate">Turno de {player.name}</span>
      <LivesHearts lives={player.lives} maxLives={game.maxLives} />
    </p>
  );
}

type PhaseProps = {
  game: Game;
  dispatch: (action: Action) => void;
};

function TurnControls({ game, dispatch }: PhaseProps) {
  const isPaused = game.timer.deadlineMs === null;

  return (
    <>
      <GameTimer
        timer={game.timer}
        onPause={() => dispatch({ type: "pause", now: Date.now() })}
        onResume={() => dispatch({ type: "resume", now: Date.now() })}
        onExpire={() => dispatch({ type: "timeout", now: Date.now() })}
      />
      <div className="flex flex-col gap-3">
        <Button
          variant="marquee"
          size="xl"
          className="w-full"
          disabled={isPaused}
          onClick={() => dispatch({ type: "right", now: Date.now() })}
        >
          <Check />
          Respondió bien
        </Button>
        <Button
          variant="secondary"
          size="xl"
          className="w-full"
          disabled={isPaused}
          onClick={() => dispatch({ type: "wrong", now: Date.now() })}
        >
          <X />
          Repitió o se equivocó
        </Button>
      </div>
    </>
  );
}

function ReadyControls({ dispatch }: Pick<PhaseProps, "dispatch">) {
  return (
    <Button
      variant="marquee"
      size="xl"
      className="w-full"
      onClick={() => dispatch({ type: "begin-turn", now: Date.now() })}
    >
      <Play />
      Arrancar
    </Button>
  );
}

function LifeLostControls({ game, dispatch }: PhaseProps) {
  const { id, lives } = game.players[game.currentIndex];
  const character = useGameCast(SLUG).forSeat(id);

  return (
    <>
      {character && (
        <CharacterAvatar character={character} expression="sad" className="self-center" />
      )}
      <p className="text-center text-xl font-semibold">
        {game.lastLoss && LOSS_MESSAGES[game.lastLoss]}{" "}
        {lives === 0
          ? "Se quedó sin vidas."
          : `Le ${lives === 1 ? "queda" : "quedan"} ${formatLives(lives)}.`}
      </p>
      <p className="text-center text-lg">Sigue {getNextPlayer(game)?.name}.</p>
      <Button
        variant="marquee"
        size="xl"
        className="w-full"
        onClick={() => dispatch({ type: "continue" })}
      >
        <Shuffle />
        Nueva categoría
      </Button>
    </>
  );
}

function getLossHeadline({ players, currentIndex }: Game) {
  const { name, lives } = players[currentIndex];
  return lives === 0 ? `${name} quedó afuera` : `${name} perdió una vida`;
}

function FinalResults({ game, dispatch }: PhaseProps) {
  const winner = getWinner(game);
  const { forSeats } = useGameCast(SLUG);

  return (
    <GameResults
      title={winner ? `¡Ganó ${winner.name}!` : "¡Se terminó!"}
      winners={winner ? forSeats([winner.id]) : []}
      onPlayAgain={() => dispatch({ type: "end" })}
    >
      {winner && (
        <p>
          Terminó con {formatLives(winner.lives)} de {game.maxLives}.
        </p>
      )}
      <p>
        {game.categoriesPlayed === 1
          ? "Jugaron 1 categoría."
          : `Jugaron ${game.categoriesPlayed} categorías.`}
      </p>
    </GameResults>
  );
}

export default function CategoriasExplosivasScreen() {
  const [session, dispatch] = useGameSession(sessionStore, reduceSession);
  const [seconds, setSeconds] = useState<SecondsOption>(DEFAULT_SECONDS);
  const [lives, setLives] = useState<LivesOption>(DEFAULT_LIVES);
  const definition = getGameBySlug(SLUG);
  const { game } = session;

  function start(count: number) {
    dispatch({
      type: "start",
      players: createPlayers(count, getGameNames(SLUG, playerNamesStore.get(), count)),
      seconds,
      lives,
    });
  }

  if (!definition) return null;

  if (game?.phase === "finished") {
    return (
      <GameFrame>
        <FinalResults game={game} dispatch={dispatch} />
      </GameFrame>
    );
  }

  if (game) {
    const isLifeLost = game.phase === "life-lost";

    return (
      <GameFrame
        status={<RoundIndicator label="Categoría" current={game.categoriesPlayed} />}
        endDescription="Se termina esta partida y nadie gana. Las categorías que ya salieron no se repiten en la próxima."
        onEnd={() => dispatch({ type: "end" })}
      >
        <PromptCard
          promptId={isLifeLost ? `loss-${game.categoryId}` : game.categoryId}
          text={isLifeLost ? getLossHeadline(game) : (getCategoryText(game.categoryId) ?? "")}
          category={definition.category}
        />
        {!isLifeLost && <TurnLine game={game} />}
        {game.phase === "ready" && <ReadyControls dispatch={dispatch} />}
        {game.phase === "turn" && <TurnControls game={game} dispatch={dispatch} />}
        {isLifeLost && <LifeLostControls game={game} dispatch={dispatch} />}
        <LivesBoard game={game} />
      </GameFrame>
    );
  }

  return (
    <GameFrame>
      <GameSetup game={definition} onStart={start}>
        {(players) => (
          <>
            <OptionGroup
              id="setup-seconds"
              label="Segundos por turno"
              options={SECONDS_OPTIONS}
              value={seconds}
              format={(option) => `${option} s`}
              onChange={setSeconds}
            />
            <OptionGroup
              id="setup-lives"
              label="Vidas por jugador"
              options={LIVES_OPTIONS}
              value={lives}
              format={String}
              onChange={setLives}
            />
            <CharacterSelector count={players} />
            <PlayerNamesFields count={players} />
          </>
        )}
      </GameSetup>
    </GameFrame>
  );
}
