"use client";

import { Check, EyeOff, Play, SkipForward } from "lucide-react";
import type { ReactNode } from "react";

import { CharacterAvatarStack } from "@/components/characters/character-avatar";
import { GameTimer } from "@/components/game/game-timer";
import { PromptCard } from "@/components/game/prompt-card";
import { Scoreboard } from "@/components/game/scoreboard";
import { Button } from "@/components/ui/button";
import { getTurnTeam, isLastTurn, type Game } from "@/games/team-turns/logic";
import type { Team } from "@/games/players";
import { useGameCast } from "@/hooks/use-game-cast";
import type { GameCategory } from "@/types/game";

type ScoresProps = {
  /** Whose cast to show; each game keeps its own. */
  slug: string;
  teams: readonly Team[];
  highlightedId?: string;
};

export function Scores({ slug, teams, highlightedId }: ScoresProps) {
  const { forSeats } = useGameCast(slug);

  return (
    <Scoreboard
      label="Puntajes"
      entries={teams.map((team) => ({
        id: team.id,
        name: team.name,
        characters: forSeats(team.playerIds),
        value: team.score,
        highlighted: team.id === highlightedId,
      }))}
    />
  );
}

/** The middle of a turn change: one message, away from any prompt. */
function TurnPanel({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-4xl bg-card p-6 text-center shadow-card">
      {children}
    </div>
  );
}

type HandoffViewProps = {
  slug: string;
  game: Game;
  /** Who takes the phone and who looks away. */
  message: string;
  onBeginTurn: () => void;
};

/** Renders no prompt: the secret only reaches the DOM once the turn begins. */
export function HandoffView({ slug, game, message, onBeginTurn }: HandoffViewProps) {
  const team = getTurnTeam(game);
  const { forSeats } = useGameCast(slug);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 pb-4">
      <TurnPanel>
        <span className="flex size-16 items-center justify-center rounded-full bg-brand-yellow text-brand-ink">
          <EyeOff aria-hidden="true" className="size-8" />
        </span>
        <h1 className="font-display text-5xl leading-none text-brand-yellow">
          Le toca a {team.name}
        </h1>
        <CharacterAvatarStack characters={forSeats(team.playerIds)} size="sm" />
        <p className="text-xl">{message}</p>
      </TurnPanel>
      <Scores slug={slug} teams={game.teams} highlightedId={team.id} />
      <Button variant="marquee" size="xl" className="w-full" onClick={onBeginTurn}>
        <Play />
        Empezar el turno
      </Button>
    </div>
  );
}

type ActingViewProps = {
  game: Game;
  surface: GameCategory;
  /** The secret card; only rendered while the clock runs. */
  renderPrompt: (promptId: string) => ReactNode;
  onHit: () => void;
  onPass: () => void;
  onPause: () => void;
  onResume: () => void;
  onExpire: () => void;
};

export function ActingView({
  game,
  surface,
  renderPrompt,
  onHit,
  onPass,
  onPause,
  onResume,
  onExpire,
}: ActingViewProps) {
  const isPaused = game.timer.deadlineMs === null;

  return (
    <>
      <GameTimer timer={game.timer} onPause={onPause} onResume={onResume} onExpire={onExpire} />
      {isPaused ? (
        <PromptCard promptId="paused" text="Pausa. La consigna está tapada." category={surface} />
      ) : (
        renderPrompt(game.promptId ?? "")
      )}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" size="xl" disabled={isPaused} onClick={onPass}>
          <SkipForward />
          Pasar
        </Button>
        <Button variant="marquee" size="xl" disabled={isPaused} onClick={onHit}>
          <Check />
          Acierto
        </Button>
      </div>
    </>
  );
}

type SummaryViewProps = {
  slug: string;
  game: Game;
  onNext: () => void;
};

export function SummaryView({ slug, game, onNext }: SummaryViewProps) {
  const team = getTurnTeam(game);
  const nextTeam = game.teams[game.turnIndex === 0 ? 1 : 0];
  const points = game.turnPoints === 1 ? "1 punto" : `${game.turnPoints} puntos`;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 pb-4">
      <TurnPanel>
        <h1 className="font-display text-5xl leading-none text-brand-yellow">
          ¡Se acabó el tiempo!
        </h1>
        <p className="text-xl">
          {team.name} sumó {points} en este turno.
        </p>
      </TurnPanel>
      <Scores slug={slug} teams={game.teams} highlightedId={team.id} />
      <Button variant="marquee" size="xl" className="w-full" onClick={onNext}>
        {isLastTurn(game) ? "Ver resultados" : `Sigue ${nextTeam.name}`}
      </Button>
    </div>
  );
}
