import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type FilterChipProps = Omit<ComponentProps<"button">, "aria-pressed"> & {
  selected: boolean;
};

export function FilterChip({ selected, className, children, ...props }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full border px-4 font-semibold transition-[background-color,border-color,color,transform] duration-200 ease-(--ease-out-expo) outline-none select-none active:scale-95 disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "border-transparent bg-brand-yellow text-brand-ink"
          : "border-border bg-card text-foreground hover:border-brand-lavender hover:bg-secondary",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
