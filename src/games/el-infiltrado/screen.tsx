"use client";

import { CharacterSelector } from "@/components/characters/character-selector";
import { GameFrame } from "@/components/game/game-frame";
import { GameResults } from "@/components/game/game-results";
import { GameSetup } from "@/components/game/game-setup";
import { PlayerNamesFields } from "@/components/game/player-names-fields";
import { RoundIndicator } from "@/components/game/round-indicator";
import { Button } from "@/components/ui/button";
import { getGameBySlug } from "@/content/catalog";
import {
  didGroupWin,
  getInfiltrator,
  getPairWords,
  reduceSession,
  sessionStore,
  SLUG,
  type Action,
  type Game,
} from "@/games/el-infiltrado/logic";
import { CluesView, RevealView, VoteView } from "@/games/el-infiltrado/play-views";
import { createPlayers } from "@/games/players";
import { useGameCast } from "@/hooks/use-game-cast";
import { useGameSession } from "@/hooks/use-game-session";
import { getGameNames } from "@/lib/character-cast";
import { playerNamesStore } from "@/lib/player-names";

function FinalResults({ game, dispatch }: { game: Game; dispatch: (action: Action) => void }) {
  const { forSeats } = useGameCast(SLUG);
  const infiltrator = getInfiltrator(game);
  const voted = game.players.find((player) => player.id === game.votedId);
  const words = getPairWords(game);
  const groupWon = didGroupWin(game);
  const groupIds = game.players.filter((player) => player.id !== infiltrator.id).map((player) => player.id);

  return (
    <GameResults
      title={groupWon ? "¡Lo encontraron!" : "¡Ganó el infiltrado!"}
      winners={forSeats(groupWon ? groupIds : [infiltrator.id])}
      onPlayAgain={() => dispatch({ type: "play-again" })}
    >
      <div className="flex flex-col gap-3">
        <p>
          El infiltrado era <strong>{infiltrator.name}</strong>.
          {!groupWon && voted && ` Votaron a ${voted.name}.`}
        </p>
        <p>
          La palabra del grupo era <strong>{words.majority}</strong> y la del infiltrado,{" "}
          <strong>{words.infiltrator}</strong>.
        </p>
        <Button
          variant="ghost"
          size="xl"
          className="w-full"
          onClick={() => dispatch({ type: "end" })}
        >
          Cambiar jugadores
        </Button>
      </div>
    </GameResults>
  );
}

export default function ElInfiltradoScreen() {
  const [session, dispatch] = useGameSession(sessionStore, reduceSession);
  const definition = getGameBySlug(SLUG);
  const { game } = session;

  function start(count: number) {
    dispatch({
      type: "start",
      players: createPlayers(count, getGameNames(SLUG, playerNamesStore.get(), count)),
    });
  }

  if (!definition) return null;

  if (game?.phase === "result") {
    return (
      <GameFrame>
        <FinalResults game={game} dispatch={dispatch} />
      </GameFrame>
    );
  }

  if (game) {
    const status =
      game.phase === "reveal" ? (
        <RoundIndicator label="Palabra" current={game.revealIndex + 1} total={game.players.length} />
      ) : (
        <RoundIndicator label="Jugadores" current={game.players.length} />
      );

    return (
      <GameFrame
        status={status}
        endDescription="Se termina esta partida sin revelar al infiltrado. Las palabras que ya salieron no se repiten en la próxima."
        onEnd={() => dispatch({ type: "end" })}
      >
        {game.phase === "reveal" && (
          <RevealView game={game} dispatch={dispatch} surface={definition.category} />
        )}
        {game.phase === "clues" && <CluesView game={game} dispatch={dispatch} />}
        {game.phase === "vote" && <VoteView game={game} dispatch={dispatch} />}
      </GameFrame>
    );
  }

  return (
    <GameFrame>
      <GameSetup game={definition} onStart={start}>
        {(players) => (
          <>
            <CharacterSelector count={players} />
            <PlayerNamesFields count={players} />
          </>
        )}
      </GameSetup>
    </GameFrame>
  );
}
