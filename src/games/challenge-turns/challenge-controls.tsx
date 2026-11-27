import { Check, Play, SkipForward, X } from "lucide-react";

import { GameTimer } from "@/components/game/game-timer";
import { Button } from "@/components/ui/button";
import type { Action, Game } from "@/games/desafio-relampago/logic";
import { formatClock } from "@/lib/timer";

type ControlsProps = {
  game: Game;
  dispatch: (action: Action) => void;
};

function TimerArea({ game, dispatch }: ControlsProps) {
  const { timer, phase, challengeId } = game;

  if (!timer) return null;

  if (phase === "idle") {
    return (
      <p className="text-center font-display text-6xl leading-none text-brand-yellow" data-tabular>
        {formatClock(timer.remainingMs)}
      </p>
    );
  }

  if (phase === "expired") {
    return (
      <p role="status" className="text-center text-2xl font-bold text-brand-pink">
        ¡Se acabó el tiempo! ¿Cómo salió?
      </p>
    );
  }

  return (
    <GameTimer
      key={challengeId}
      timer={timer}
      onPause={() => dispatch({ type: "pause", now: Date.now() })}
      onResume={() => dispatch({ type: "resume", now: Date.now() })}
      onExpire={() => dispatch({ type: "expire", now: Date.now() })}
    />
  );
}

export function ChallengeControls({ game, dispatch }: ControlsProps) {
  const needsTimerStart = game.timer !== null && game.phase === "idle";

  return (
    <div className="flex flex-col gap-3">
      <TimerArea game={game} dispatch={dispatch} />

      {needsTimerStart ? (
        <Button
          variant="marquee"
          size="xl"
          className="w-full"
          onClick={() => dispatch({ type: "start-timer", now: Date.now() })}
        >
          <Play />
          Arrancar cronómetro
        </Button>
      ) : (
        <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
          <Button
            variant="marquee"
            size="xl"
            className="w-full px-2"
            onClick={() => dispatch({ type: "resolve", outcome: "completed" })}
          >
            <Check />
            Completado
          </Button>
          <Button
            variant="secondary"
            size="xl"
            className="w-full px-2"
            onClick={() => dispatch({ type: "resolve", outcome: "failed" })}
          >
            <X />
            Fallido
          </Button>
        </div>
      )}

      <Button
        variant="ghost"
        size="xl"
        className="w-full"
        onClick={() => dispatch({ type: "resolve", outcome: "skipped" })}
      >
        <SkipForward />
        Saltar
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Nadie está obligado: saltar no tiene penalidad.
      </p>
    </div>
  );
}
