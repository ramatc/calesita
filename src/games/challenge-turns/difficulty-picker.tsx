import { OptionGroup } from "@/components/design/option-group";
import { DIFFICULTY_LABELS } from "@/content/labels";
import { DIFFICULTY_OPTIONS, type DifficultyOption } from "@/games/desafio-relampago/logic";

const OPTION_LABELS: Record<DifficultyOption, string> = {
  ...DIFFICULTY_LABELS,
  mixed: "Mezclada",
};

type DifficultyPickerProps = {
  value: DifficultyOption;
  onChange: (value: DifficultyOption) => void;
};

export function DifficultyPicker({ value, onChange }: DifficultyPickerProps) {
  return (
    <OptionGroup
      id="setup-difficulty"
      label="¿Qué tan difícil?"
      options={DIFFICULTY_OPTIONS}
      value={value}
      format={(option) => OPTION_LABELS[option]}
      onChange={onChange}
    />
  );
}
