"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ROUNDS_OPTIONS,
  TURN_SECONDS_OPTIONS,
  type Rounds,
  type TurnSeconds,
} from "@/games/actua-o-perdes/logic";

const MAX_NAME_LENGTH = 20;
const TEAM_LABELS = ["Equipo 1", "Equipo 2"];

export type SetupValues = {
  teamNames: readonly string[];
  turnSeconds: TurnSeconds;
  rounds: Rounds;
};

type OptionChipsProps<T extends number> = {
  id: string;
  label: string;
  options: readonly T[];
  value: T;
  format: (option: T) => string;
  onChange: (option: T) => void;
};

function OptionChips<T extends number>({
  id,
  label,
  options,
  value,
  format,
  onChange,
}: OptionChipsProps<T>) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span id={id} className="font-semibold text-muted-foreground">
        {label}
      </span>
      <div role="group" aria-labelledby={id} className="flex gap-2">
        {options.map((option) => (
          <Button
            key={option}
            variant={option === value ? "marquee" : "secondary"}
            size="chip"
            aria-pressed={option === value}
            onClick={() => onChange(option)}
          >
            {format(option)}
          </Button>
        ))}
      </div>
    </div>
  );
}

type SetupOptionsProps = {
  values: SetupValues;
  onChange: (values: SetupValues) => void;
};

export function SetupOptions({ values, onChange }: SetupOptionsProps) {
  function setTeamName(index: number, name: string) {
    onChange({
      ...values,
      teamNames: TEAM_LABELS.map((_, position) =>
        position === index ? name : (values.teamNames[position] ?? ""),
      ),
    });
  }

  return (
    <>
      <OptionChips
        id="setup-turn-seconds"
        label="¿Cuánto dura cada turno?"
        options={TURN_SECONDS_OPTIONS}
        value={values.turnSeconds}
        format={(seconds) => `${seconds} s`}
        onChange={(turnSeconds) => onChange({ ...values, turnSeconds })}
      />
      <OptionChips
        id="setup-rounds"
        label="¿Cuántas rondas?"
        options={ROUNDS_OPTIONS}
        value={values.rounds}
        format={String}
        onChange={(rounds) => onChange({ ...values, rounds })}
      />
      <details className="rounded-2xl bg-card p-4">
        <summary className="cursor-pointer font-semibold">
          Ponerles nombre a los equipos (opcional)
        </summary>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {TEAM_LABELS.map((label, index) => (
            <div key={label} className="flex flex-col gap-1">
              <Label htmlFor={`team-name-${index}`}>{label}</Label>
              <Input
                id={`team-name-${index}`}
                className="h-11 text-base"
                maxLength={MAX_NAME_LENGTH}
                autoComplete="off"
                value={values.teamNames[index] ?? ""}
                onChange={(event) => setTeamName(index, event.target.value)}
              />
            </div>
          ))}
        </div>
      </details>
    </>
  );
}
