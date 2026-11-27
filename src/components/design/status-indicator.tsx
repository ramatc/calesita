import { STATUS_LABELS } from "@/content/labels";
import { cn } from "@/lib/utils";
import type { GameStatus } from "@/types/game";

type StatusIndicatorProps = {
  status: GameStatus;
  className?: string;
};

/**
 * Only a game the group cannot play yet gets a label: "Disponible" on every
 * card said nothing once the whole catalog was playable.
 */
export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  if (status === "available") return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-muted-foreground",
        className,
      )}
    >
      <span aria-hidden="true" className="size-2 rounded-full border-2 border-brand-lavender" />
      {STATUS_LABELS[status]}
    </span>
  );
}
