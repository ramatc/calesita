type ProgressIndicatorProps = {
  value: number;
  max: number;
  label: string;
};

export function ProgressIndicator({ value, max, label }: ProgressIndicatorProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className="h-2 overflow-hidden rounded-full bg-secondary"
    >
      <div
        className="h-full rounded-full bg-brand-yellow transition-[width] duration-300 ease-out"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}
