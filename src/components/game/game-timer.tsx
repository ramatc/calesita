"use client";

import { Pause, Play } from "lucide-react";

import { ProgressIndicator } from "@/components/game/progress-indicator";
import { Button } from "@/components/ui/button";
import { useTimer } from "@/hooks/use-timer";
import { formatClock, type Timer } from "@/lib/timer";
import { cn } from "@/lib/utils";

const LOW_TIME_MS = 5_000;

type GameTimerProps = {
  timer: Timer;
  onPause: () => void;
  onResume: () => void;
  onExpire: () => void;
};

export function GameTimer({ timer, onPause, onResume, onExpire }: GameTimerProps) {
  const remainingMs = useTimer(timer, onExpire);
  const isRunning = timer.deadlineMs !== null;
  const isLow = remainingMs <= LOW_TIME_MS;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <time
          role="timer"
          className={cn(
            "font-display text-6xl leading-none text-brand-yellow",
            isLow && "text-brand-pink",
            isLow && isRunning && "animate-twinkle",
          )}
        >
          {formatClock(remainingMs)}
        </time>
        <Button
          variant="secondary"
          size="xl"
          aria-label={isRunning ? "Pausar cronómetro" : "Seguir cronómetro"}
          onClick={isRunning ? onPause : onResume}
        >
          {isRunning ? <Pause /> : <Play />}
          {isRunning ? "Pausar" : "Seguir"}
        </Button>
      </div>
      <ProgressIndicator value={remainingMs} max={timer.durationMs} label="Tiempo restante" />
    </div>
  );
}
