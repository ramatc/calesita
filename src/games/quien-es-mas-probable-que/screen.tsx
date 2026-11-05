"use client";

import { Hand, SkipForward } from "lucide-react";
import { useState } from "react";

import { GameFrame } from "@/components/game/game-frame";
import { GameResults } from "@/components/game/game-results";
import { GameSetup } from "@/components/game/game-setup";
import { ProgressIndicator } from "@/components/game/progress-indicator";
import { PromptCard } from "@/components/game/prompt-card";
import { RoundIndicator } from "@/components/game/round-indicator";
import { Button } from "@/components/ui/button";
import { getGameBySlug } from "@/content/catalog";
import { getQuestionText, QUESTION_IDS } from "@/content/quien-es-mas-probable-que";
import { getDeckProgress } from "@/games/deck";
import {
  reduceSession,
  sessionStore,
  type Game,
} from "@/games/quien-es-mas-probable-que/logic";
import { useCountdown } from "@/hooks/use-countdown";
import { useGameSession } from "@/hooks/use-game-session";

const COUNTDOWN_SECONDS = 3;

function Countdown({ onDone }: { onDone: () => void }) {
  const remaining = useCountdown(COUNTDOWN_SECONDS, onDone);

  return (
    <p
      key={remaining}
      aria-live="assertive"
      className="animate-deal text-center font-display text-7xl text-brand-yellow"
      data-tabular
    >
      {remaining}
    </p>
  );
}

type PlayControlsProps = {
  phase: Game["phase"];
  onCallVote: () => void;
  onReveal: () => void;
  onNext: () => void;
};

function PlayControls({ phase, onCallVote, onReveal, onNext }: PlayControlsProps) {
  if (phase === "countdown") {
    return (
      <div className="flex h-32 flex-col items-center justify-center">
        <Countdown onDone={onReveal} />
      </div>
    );
  }

  if (phase === "pointing") {
    return (
      <div className="flex h-32 flex-col gap-3">
        <p className="text-center text-2xl font-bold">¡Señalen! Ahora, a debatir.</p>
        <Button variant="marquee" size="xl" className="w-full" onClick={onNext}>
          Siguiente pregunta
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-32 flex-col gap-3">
      <Button variant="marquee" size="xl" className="w-full" onClick={onCallVote}>
        <Hand />
        Contar y señalar
      </Button>
      <Button variant="ghost" size="xl" className="w-full" onClick={onNext}>
        <SkipForward />
        Pasar esta pregunta
      </Button>
    </div>
  );
}

export default function QuienEsMasProbableScreen() {
  const [session, dispatch] = useGameSession(sessionStore, reduceSession);
  const [lastGame, setLastGame] = useState<Pick<Game, "players" | "asked"> | null>(null);
  const definition = getGameBySlug("quien-es-mas-probable-que");
  const { game } = session;

  function start(players: number) {
    setLastGame(null);
    dispatch({ type: "start", players });
  }

  if (!definition) return null;

  if (game) {
    const { dealt, total } = getDeckProgress(session.deck, QUESTION_IDS);

    return (
      <GameFrame
        status={<RoundIndicator label="Pregunta" current={game.asked} />}
        endDescription="Se termina esta partida. Las preguntas que ya salieron no se repiten en la próxima."
        onEnd={() => {
          setLastGame(game);
          dispatch({ type: "end" });
        }}
      >
        <ProgressIndicator value={dealt} max={total} label="Preguntas del mazo ya usadas" />
        <PromptCard
          promptId={game.questionId}
          text={getQuestionText(game.questionId) ?? ""}
          category={definition.category}
        />
        <PlayControls
          phase={game.phase}
          onCallVote={() => dispatch({ type: "call-vote" })}
          onReveal={() => dispatch({ type: "reveal" })}
          onNext={() => dispatch({ type: "next" })}
        />
      </GameFrame>
    );
  }

  if (lastGame) {
    return (
      <GameFrame>
        <GameResults title="¡Qué juntada!" onPlayAgain={() => start(lastGame.players)}>
          {lastGame.asked === 1
            ? "Jugaron 1 pregunta."
            : `Jugaron ${lastGame.asked} preguntas.`}
        </GameResults>
      </GameFrame>
    );
  }

  return (
    <GameFrame>
      <GameSetup game={definition} onStart={start} />
    </GameFrame>
  );
}
