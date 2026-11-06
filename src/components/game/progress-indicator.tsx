import { cn } from "@/lib/utils";

type ProgressIndicatorProps = {
  value: number;
  max: number;
  label: string;
  /** Turns the bar pink when time is running out. */
  urgent?: boolean;
};

export function ProgressIndicator({ value, max, label, urgent }: ProgressIndicatorProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className="h-3 overflow-hidden rounded-full bg-secondary"
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width,background-color] duration-300 ease-out",
          urgent ? "bg-brand-pink" : "bg-brand-yellow",
        )}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}
