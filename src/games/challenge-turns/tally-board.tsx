import { Check, SkipForward, X, type LucideIcon } from "lucide-react";

import { Scoreboard } from "@/components/game/scoreboard";
import type { Outcome, Tally } from "@/games/challenge-turns/logic";
import { DEFAULT_WORDING, type ChallengeWording } from "@/games/challenge-turns/wording";
import type { Player } from "@/games/players";
import { useGameCast } from "@/hooks/use-game-cast";

function getColumns(wording: ChallengeWording): { outcome: Outcome; label: string; Icon: LucideIcon }[] {
  return [
    { outcome: "completed", label: wording.completedPlural, Icon: Check },
    { outcome: "failed", label: wording.failedPlural, Icon: X },
    { outcome: "skipped", label: "Saltados", Icon: SkipForward },
  ];
}

function TallyValue({ tally, wording }: { tally: Tally; wording: ChallengeWording }) {
  return (
    <span className="flex items-center gap-3">
      {getColumns(wording).map(({ outcome, label, Icon }) => (
        <span key={outcome} className="flex items-center gap-1">
          <Icon aria-hidden className="size-4" />
          <span className="sr-only">{label}:</span>
          {tally[outcome]}
        </span>
      ))}
    </span>
  );
}

type TallyBoardProps = {
  slug: string;
  wording?: ChallengeWording;
  players: readonly Player[];
  tallies: readonly Tally[];
  /** Whose turn it is, while a game runs. */
  turn?: number;
};

export function TallyBoard({
  slug,
  wording = DEFAULT_WORDING,
  players,
  tallies,
  turn,
}: TallyBoardProps) {
  const { forSeats } = useGameCast(slug);

  return (
    <Scoreboard
      label="Resultados por jugador"
      entries={players.map((player, index) => ({
        id: player.id,
        name: player.name,
        characters: forSeats([player.id]),
        value: <TallyValue tally={tallies[index]} wording={wording} />,
        highlighted: index === turn,
      }))}
    />
  );
}
