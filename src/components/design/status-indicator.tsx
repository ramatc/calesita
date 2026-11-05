import { STATUS_LABELS } from "@/content/labels";
import { cn } from "@/lib/utils";
import type { GameStatus } from "@/types/game";

type StatusIndicatorProps = {
  status: GameStatus;
  className?: string;
};

/** Availability reads by shape as well as color: a solid dot means playable now. */
export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const isAvailable = status === "available";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
        isAvailable ? "bg-brand-teal/15 text-brand-teal" : "bg-secondary text-muted-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-2 rounded-full",
          isAvailable ? "bg-brand-teal" : "border-2 border-brand-lavender",
        )}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}
