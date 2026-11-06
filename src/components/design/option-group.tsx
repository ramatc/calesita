import { FilterChip } from "@/components/design/filter-chip";

type OptionGroupProps<T extends string | number> = {
  id: string;
  label: string;
  options: readonly T[];
  value: T;
  format: (option: T) => string;
  onChange: (option: T) => void;
};

/** A single choice among a few short options, used by game setup screens. */
export function OptionGroup<T extends string | number>({
  id,
  label,
  options,
  value,
  format,
  onChange,
}: OptionGroupProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <span id={id} className="font-semibold text-muted-foreground">
        {label}
      </span>
      <div role="group" aria-labelledby={id} className="flex flex-wrap gap-2">
        {options.map((option) => (
          <FilterChip key={option} selected={option === value} onClick={() => onChange(option)}>
            {format(option)}
          </FilterChip>
        ))}
      </div>
    </div>
  );
}
