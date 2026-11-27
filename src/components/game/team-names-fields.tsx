"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MAX_NAME_LENGTH = 20;
const TEAM_LABELS = ["Equipo 1", "Equipo 2"];

type TeamNamesFieldsProps = {
  names: readonly string[];
  onChange: (names: string[]) => void;
};

/** Optional names for the two teams; an empty one keeps the default name. */
export function TeamNamesFields({ names, onChange }: TeamNamesFieldsProps) {
  function setName(index: number, name: string) {
    onChange(TEAM_LABELS.map((_, position) => (position === index ? name : (names[position] ?? ""))));
  }

  return (
    <details className="rounded-2xl bg-secondary px-4 py-1.5">
      <summary className="cursor-pointer py-2.5 font-semibold">
        Ponerles nombre a los equipos (opcional)
      </summary>
      <div className="mt-2 mb-2.5 grid gap-3 sm:grid-cols-2">
        {TEAM_LABELS.map((label, index) => (
          <div key={label} className="flex flex-col gap-1">
            <Label htmlFor={`team-name-${index}`}>{label}</Label>
            <Input
              id={`team-name-${index}`}
              className="h-11 text-base"
              maxLength={MAX_NAME_LENGTH}
              autoComplete="off"
              value={names[index] ?? ""}
              onChange={(event) => setName(index, event.target.value)}
            />
          </div>
        ))}
      </div>
    </details>
  );
}
