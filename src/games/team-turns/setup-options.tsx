"use client";

import { OptionGroup } from "@/components/design/option-group";
import { TeamNamesFields } from "@/components/game/team-names-fields";
import {
  ROUNDS_OPTIONS,
  TURN_SECONDS_OPTIONS,
  type Rounds,
  type TurnSeconds,
} from "@/games/team-turns/logic";

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
      <TeamNamesFields
        names={values.teamNames}
        onChange={(teamNames) => onChange({ ...values, teamNames })}
      />
    </>
  );
}
