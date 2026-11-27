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
        "inline-flex items-center gap-2 rounded-arcade-control border-2 border-dashed border-current px-2.5 py-0.5 font-pixel text-xl leading-none tracking-wide text-muted-foreground uppercase",
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
