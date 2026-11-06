"use client";

import { OptionGroup } from "@/components/design/option-group";
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
      <OptionGroup
        id="setup-turn-seconds"
        label="¿Cuánto dura cada turno?"
        options={TURN_SECONDS_OPTIONS}
        value={values.turnSeconds}
        format={(seconds) => `${seconds} s`}
        onChange={(turnSeconds) => onChange({ ...values, turnSeconds })}
      />
      <OptionGroup
        id="setup-rounds"
        label="¿Cuántas rondas?"
        options={ROUNDS_OPTIONS}
        value={values.rounds}
        format={String}
        onChange={(rounds) => onChange({ ...values, rounds })}
      />
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
