import type { ReactNode } from "react";

import { CharacterAvatarStack } from "@/components/characters/character-avatar";
import { cn } from "@/lib/utils";
import type { Character } from "@/types/character";

export type ScoreboardEntry = {
  id: string;
  name: string;
  value: ReactNode;
  /** Who plays in this row, when they chose a character. */
  characters?: readonly Character[];
  /** Whose turn it is, or who is winning. */
  highlighted?: boolean;
  /** For someone who is out of the game. */
  dimmed?: boolean;
};

type ScoreboardProps = {
  label: string;
  entries: readonly ScoreboardEntry[];
};

export function Scoreboard({ label, entries }: ScoreboardProps) {
  return (
    <ul aria-label={label} className="flex flex-col gap-2">
      {entries.map((entry) => (
        <li
          key={entry.id}
          aria-current={entry.highlighted ? "true" : undefined}
          className={cn(
            "flex items-center justify-between gap-3 rounded-2xl bg-card px-4 py-3 text-lg font-semibold shadow-card",
            entry.highlighted && "bg-brand-yellow text-brand-ink",
            entry.dimmed && "opacity-50",
          )}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            {entry.characters && <CharacterAvatarStack characters={entry.characters} />}
            <span className="min-w-0 truncate">{entry.name}</span>
          </span>
          <span className="shrink-0 font-display text-xl" data-tabular>
            {entry.value}
          </span>
        </li>
      ))}
    </ul>
  );
}
