"use client";

import { ArrowRight, Eye, EyeOff, MessageCircle, Vote } from "lucide-react";
import type { ReactNode } from "react";

import { CharacterAvatar } from "@/components/characters/character-avatar";
import { PromptCard } from "@/components/game/prompt-card";
import { Scoreboard } from "@/components/game/scoreboard";
import { Button } from "@/components/ui/button";
import {
  getFirstCluePlayer,
  getRevealPlayer,
  getWordFor,
  isLastReveal,
  SLUG,
  type Action,
  type Game,
} from "@/games/el-infiltrado/logic";
import { useGameCast } from "@/hooks/use-game-cast";
import { cn } from "@/lib/utils";
import type { GameCategory } from "@/types/game";

type ViewProps = {
  game: Game;
  dispatch: (action: Action) => void;
};

/** One message between secrets, with nothing else on screen. */
function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-4xl bg-card p-6 text-center shadow-card">
      {children}
    </div>
  );
}

function Headline({ children }: { children: ReactNode }) {
  return <h1 className="font-display text-5xl leading-none text-brand-yellow">{children}</h1>;
}

function ViewColumn({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 pb-4">{children}</div>;
}

/**
 * Revelar, Ocultar, Pasar al siguiente. The word only reaches the DOM while it is
 * revealed, and once hidden it cannot be shown again, so the next player never sees it.
 */
export function RevealView({ game, dispatch, surface }: ViewProps & { surface: GameCategory }) {
  const player = getRevealPlayer(game);
  const nextPlayer = game.players[game.revealIndex + 1];
  const character = useGameCast(SLUG).forSeat(player.id);

  if (game.revealStep === "revealed") {
    return (
      <ViewColumn>
        <p className="text-center text-lg font-semibold text-muted-foreground">
          {player.name}, tu palabra es
        </p>
        <PromptCard
          promptId={`word-${game.revealIndex}`}
          text={getWordFor(game, player.id)}
          category={surface}
        />
        <p className="text-center text-lg">Memorizala y tapala antes de pasar el celular.</p>
        <Button
          variant="marquee"
          size="xl"
          className="w-full"
          onClick={() => dispatch({ type: "hide" })}
        >
          <EyeOff />
          Ocultar
        </Button>
      </ViewColumn>
    );
  }

  if (game.revealStep === "hidden") {
    const isLast = isLastReveal(game);
    return (
      <ViewColumn>
        <Panel>
          <span className="flex size-16 items-center justify-center rounded-full bg-brand-yellow text-brand-ink">
            <EyeOff aria-hidden="true" className="size-8" />
          </span>
          <Headline>Palabra tapada</Headline>
          <p className="text-xl">
            {isLast
              ? "Ya vieron todos. Dejen el celular en el medio de la ronda."
              : `Pasale el celular a ${nextPlayer?.name}.`}
          </p>
        </Panel>
        <Button
          variant="marquee"
          size="xl"
          className="w-full"
          onClick={() => dispatch({ type: "pass" })}
        >
          <ArrowRight />
          {isLast ? "Empezar la ronda de pistas" : "Pasar al siguiente"}
        </Button>
      </ViewColumn>
    );
  }

  return (
    <ViewColumn>
      <Panel>
        {character && <CharacterAvatar character={character} />}
        <Headline>Turno de {player.name}</Headline>
        <p className="text-xl">
          Agarrá el celular y fijate que nadie más esté mirando la pantalla.
        </p>
      </Panel>
      <Button
        variant="marquee"
        size="xl"
        className="w-full"
        onClick={() => dispatch({ type: "reveal" })}
      >
        <Eye />
        Revelar
      </Button>
    </ViewColumn>
  );
}

/** Turn order for clues, starting with the chosen player. */
function getClueOrder(game: Game) {
  const start = game.firstClueIndex;
  return [...game.players.slice(start), ...game.players.slice(0, start)];
}

export function CluesView({ game, dispatch }: ViewProps) {
  const { forSeats } = useGameCast(SLUG);
  const first = getFirstCluePlayer(game);

  return (
    <ViewColumn>
      <Panel>
        <span className="flex size-16 items-center justify-center rounded-full bg-brand-yellow text-brand-ink">
          <MessageCircle aria-hidden="true" className="size-8" />
        </span>
        <Headline>Ronda de pistas</Headline>
        <p className="text-xl">
          Empieza {first.name}. Cada uno da una pista de su palabra, sin decirla.
        </p>
      </Panel>
      <Scoreboard
        label="Orden de las pistas"
        entries={getClueOrder(game).map((player, index) => ({
          id: player.id,
          name: player.name,
          characters: forSeats([player.id]),
          value: index + 1,
          highlighted: index === 0,
        }))}
      />
      <Button
        variant="marquee"
        size="xl"
        className="w-full"
        onClick={() => dispatch({ type: "start-vote" })}
      >
        <Vote />
        Ir a la votación
      </Button>
    </ViewColumn>
  );
}

export function VoteView({ game, dispatch }: ViewProps) {
  const { forSeat } = useGameCast(SLUG);

  return (
    <ViewColumn>
      <div className="flex flex-col gap-2 text-center">
        <Headline>¿Quién es el infiltrado?</Headline>
        <p className="text-xl">Debatan, voten en voz alta y marquen a quién eligieron.</p>
      </div>
      <ul aria-label="Jugadores" className="grid gap-2 sm:grid-cols-2">
        {game.players.map((player) => {
          const character = forSeat(player.id);
          const isChosen = game.votedId === player.id;
          return (
            <li key={player.id}>
              <button
                type="button"
                aria-pressed={isChosen}
                onClick={() => dispatch({ type: "vote", playerId: player.id })}
                className={cn(
                  "flex min-h-14 w-full items-center gap-3 rounded-2xl bg-card px-4 py-3 text-left text-lg font-semibold shadow-card transition-transform outline-none focus-visible:ring-3 focus-visible:ring-ring active:scale-[0.98]",
                  isChosen && "bg-brand-yellow text-brand-ink",
                )}
              >
                {character && <CharacterAvatar character={character} size="sm" />}
                <span className="min-w-0 truncate">{player.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <Button
        variant="marquee"
        size="xl"
        className="w-full"
        disabled={game.votedId === null}
        onClick={() => dispatch({ type: "reveal-infiltrator" })}
      >
        <Eye />
        Revelar al infiltrado
      </Button>
    </ViewColumn>
  );
}
