import { Check, SkipForward, X, type LucideIcon } from "lucide-react";

import { Scoreboard } from "@/components/game/scoreboard";
import type { Outcome, Tally } from "@/games/desafio-relampago/logic";
import type { Player } from "@/games/players";

const COLUMNS: { outcome: Outcome; label: string; Icon: LucideIcon }[] = [
  { outcome: "completed", label: "Completados", Icon: Check },
  { outcome: "failed", label: "Fallidos", Icon: X },
  { outcome: "skipped", label: "Saltados", Icon: SkipForward },
];

function TallyValue({ tally }: { tally: Tally }) {
  return (
    <span className="flex items-center gap-3">
      {COLUMNS.map(({ outcome, label, Icon }) => (
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
  players: readonly Player[];
  tallies: readonly Tally[];
  /** Whose turn it is, while a game runs. */
  turn?: number;
};

export function TallyBoard({ players, tallies, turn }: TallyBoardProps) {
  return (
    <Scoreboard
      label="Resultados por jugador"
      entries={players.map((player, index) => ({
        id: player.id,
        name: player.name,
        value: <TallyValue tally={tallies[index]} />,
        highlighted: index === turn,
      }))}
    />
  );
}
