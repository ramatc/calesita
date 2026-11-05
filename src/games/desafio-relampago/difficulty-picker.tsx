import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col items-center gap-2">
      <span id="setup-difficulty" className="font-semibold text-muted-foreground">
        ¿Qué tan difícil?
      </span>
      <div
        role="group"
        aria-labelledby="setup-difficulty"
        className="flex flex-wrap justify-center gap-2"
      >
        {DIFFICULTY_OPTIONS.map((option) => (
          <Button
            key={option}
            variant={value === option ? "marquee" : "secondary"}
            size="chip"
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {OPTION_LABELS[option]}
          </Button>
        ))}
      </div>
    </div>
  );
}
