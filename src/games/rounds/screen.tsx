"use client";

import { Check, Play, UserX } from "lucide-react";
import { useState, type ReactNode } from "react";

import { CharacterSelector } from "@/components/characters/character-selector";
import { OptionGroup } from "@/components/design/option-group";
import { GameFrame } from "@/components/game/game-frame";
import { GameResults } from "@/components/game/game-results";
import { GameSetup } from "@/components/game/game-setup";
import { GameTimer } from "@/components/game/game-timer";
import { PlayerNamesFields } from "@/components/game/player-names-fields";
import { TeamNamesFields } from "@/components/game/team-names-fields";
import { RoundIndicator } from "@/components/game/round-indicator";
import { Scoreboard } from "@/components/game/scoreboard";
import { Button } from "@/components/ui/button";
import { getGameBySlug } from "@/content/catalog";
import { createPlayers, createTeams } from "@/games/players";
import {
  getLeaders,
  type Action,
  type Game,
  type Participant,
  type Session,
} from "@/games/rounds/logic";
import { useGameCast } from "@/hooks/use-game-cast";
import { useGameSession } from "@/hooks/use-game-session";
import { getGameNames } from "@/lib/character-cast";
import { playerNamesStore } from "@/lib/player-names";
import type { PersistentStore } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { formatClock } from "@/lib/timer";
import type { GameSlug } from "@/types/game";

const TEAMS_HINT = "Los números impares van a un equipo y los pares al otro.";

export type RoundsScreenProps = {
  slug: GameSlug;
  sessionStore: PersistentStore<Session>;
  reduceSession: (session: Session, action: Action) => Session;
  /** Players compete one by one, or split in two teams. */
  mode: "players" | "teams";
  roundsLabel: string;
  roundsOptions: readonly number[];
  defaultRounds: number;
  /** Turns the chosen option into the real number of rounds, such as one per player. */
  toRounds?: (option: number, participants: number) => number;
  roundLabel: string;
  renderCard: (game: Game) => ReactNode;
  /** "one" picks a single winner or nobody; "many" ticks everyone who scored. */
  judge: "one" | "many";
  judgeQuestion: string;
  /** Replaces the built-in judging, for games that score by themselves. */
  renderJudge?: (game: Game, award: (winnerIds: string[]) => void) => ReactNode;
  resultsTitle: string;
  endDescription: string;
};

function toParticipants(
  mode: RoundsScreenProps["mode"],
  slug: GameSlug,
  count: number,
  teamNames: readonly string[],
) {
  const players = createPlayers(count, getGameNames(slug, playerNamesStore.get(), count));
  if (mode === "players") {
    return players.map((player) => ({ id: player.id, name: player.name, seatIds: [player.id] }));
  }
  return createTeams(players, teamNames).map((team) => ({
    id: team.id,
    name: team.name,
    seatIds: team.playerIds,
  }));
}

function Scores({ slug, participants, highlightedId }: {
  slug: GameSlug;
  participants: readonly Participant[];
  highlightedId?: string;
}) {
  const { forSeats } = useGameCast(slug);
  return (
    <Scoreboard
      label="Puntajes"
      entries={participants.map((participant) => ({
        id: participant.id,
        name: participant.name,
        characters: forSeats(participant.seatIds),
        value: participant.score,
        highlighted: participant.id === highlightedId,
      }))}
    />
  );
}

type JudgeProps = {
  game: Game;
  judge: RoundsScreenProps["judge"];
  question: string;
  onAward: (winnerIds: string[]) => void;
};

function Judge({ game, judge, question, onAward }: JudgeProps) {
  const [picked, setPicked] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-xl font-semibold">{question}</p>
      <ul className="grid grid-cols-2 gap-2">
        {game.participants.map((participant) => {
          const isPicked = picked.includes(participant.id);
          return (
            <li key={participant.id}>
              <Button
                variant={isPicked ? "marquee" : "secondary"}
                size="xl"
                aria-pressed={judge === "many" ? isPicked : undefined}
                className={cn("w-full px-2", judge === "many" && "justify-start")}
                onClick={() =>
                  judge === "one"
                    ? onAward([participant.id])
                    : setPicked(
                        isPicked
                          ? picked.filter((id) => id !== participant.id)
                          : [...picked, participant.id],
                      )
                }
              >
                {judge === "many" && isPicked && <Check />}
                <span className="truncate">{participant.name}</span>
              </Button>
            </li>
          );
        })}
      </ul>
      {judge === "many" ? (
        <Button variant="marquee" size="xl" className="w-full" onClick={() => onAward(picked)}>
          {picked.length === 0 ? "Nadie sumó, siguiente" : "Sumar y seguir"}
        </Button>
      ) : (
        <Button variant="ghost" size="xl" className="w-full" onClick={() => onAward([])}>
          <UserX />
          Nadie
        </Button>
      )}
    </div>
  );
}

export function RoundsScreen(props: RoundsScreenProps) {
  const { slug, sessionStore, reduceSession, mode } = props;
  const [session, dispatch] = useGameSession(sessionStore, reduceSession);
  const [roundsOption, setRoundsOption] = useState(props.defaultRounds);
  const [lastGame, setLastGame] = useState<Game | null>(null);
  const [teamNames, setTeamNames] = useState<string[]>([]);
  const definition = getGameBySlug(slug);
  const { forSeats } = useGameCast(slug);
  const { game } = session;

  function start(count: number, option: number) {
    setLastGame(null);
    const participants = toParticipants(mode, slug, count, teamNames);
    const rounds = props.toRounds?.(option, participants.length) ?? option;
    dispatch({ type: "start", participants, rounds });
  }

  if (!definition) return null;

  if (game?.phase === "finished") {
    const leaders = getLeaders(game);
    const count = game.participants.flatMap((participant) => participant.seatIds).length;
    return (
      <GameFrame>
        <GameResults
          title={leaders.length > 1 ? "¡Empate!" : `¡Ganó ${leaders[0].name}!`}
          winners={leaders.length === 1 ? forSeats(leaders[0].seatIds) : []}
          onPlayAgain={() => start(count, roundsOption)}
        >
          <div className="flex flex-col gap-3">
            <Scores slug={slug} participants={game.participants} />
            <Button variant="ghost" size="xl" className="w-full" onClick={() => dispatch({ type: "end" })}>
              Cambiar opciones
            </Button>
          </div>
        </GameResults>
      </GameFrame>
    );
  }

  if (game) {
    const award = (winnerIds: string[]) => dispatch({ type: "award", winnerIds });
    return (
      <GameFrame
        status={<RoundIndicator label={props.roundLabel} current={game.round} total={game.totalRounds} />}
        endDescription={props.endDescription}
        onEnd={() => {
          setLastGame(game);
          dispatch({ type: "end" });
        }}
      >
        {props.renderCard(game)}
        {game.timer && game.phase === "ready" && (
          <>
            <p className="text-center font-display text-6xl leading-none text-brand-yellow" data-tabular>
              {formatClock(game.timer.remainingMs)}
            </p>
            <Button
              variant="marquee"
              size="xl"
              className="w-full"
              onClick={() => dispatch({ type: "start-timer", now: Date.now() })}
            >
              <Play />
              Arrancar cronómetro
            </Button>
          </>
        )}
        {game.timer && (game.phase === "running" || game.phase === "paused") && (
          <GameTimer
            key={`${game.round}-${game.cardId}`}
            timer={game.timer}
            onPause={() => dispatch({ type: "pause", now: Date.now() })}
            onResume={() => dispatch({ type: "resume", now: Date.now() })}
            onExpire={() => dispatch({ type: "expire", now: Date.now() })}
          />
        )}
        {game.phase !== "ready" &&
          (props.renderJudge ? (
            props.renderJudge(game, award)
          ) : (
            <Judge key={game.round} game={game} judge={props.judge} question={props.judgeQuestion} onAward={award} />
          ))}
        <Scores slug={slug} participants={game.participants} />
      </GameFrame>
    );
  }

  if (lastGame) {
    const count = lastGame.participants.flatMap((participant) => participant.seatIds).length;
    return (
      <GameFrame>
        <GameResults title="Partida terminada" onPlayAgain={() => start(count, roundsOption)}>
          <Scores slug={slug} participants={lastGame.participants} />
        </GameResults>
      </GameFrame>
    );
  }

  return (
    <GameFrame>
      <GameSetup game={definition} onStart={(count) => start(count, roundsOption)}>
        {(count) => (
          <>
            <OptionGroup
              id="setup-rounds"
              label={props.roundsLabel}
              options={props.roundsOptions}
              value={roundsOption}
              format={String}
              onChange={setRoundsOption}
            />
            <CharacterSelector count={count} hint={mode === "teams" ? TEAMS_HINT : undefined} />
            {mode === "players" ? (
              <PlayerNamesFields count={count} />
            ) : (
              <TeamNamesFields names={teamNames} onChange={setTeamNames} />
            )}
          </>
        )}
      </GameSetup>
    </GameFrame>
  );
}
