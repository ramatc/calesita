import type { ComponentProps } from "react";

import { ArcadeChip } from "@/components/arcade/arcade-chip";

type FilterChipProps = Omit<ComponentProps<"button">, "aria-pressed"> & {
  selected: boolean;
};

/** Kept as the shared name for filters and option groups; it renders the arcade key. */
export function FilterChip(props: FilterChipProps) {
  return <ArcadeChip {...props} />;
}
