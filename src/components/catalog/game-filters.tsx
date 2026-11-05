"use client";

import { SlidersHorizontal } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

import { PlayerCountPicker } from "@/components/catalog/player-count-picker";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_LABELS,
  DURATION_LABELS,
  MATERIAL_FILTER_LABELS,
} from "@/content/labels";
import {
  CATEGORIES,
  DURATION_BUCKETS,
  MATERIAL_FILTERS,
  type CatalogParams,
} from "@/games/catalog-query";
import { cn } from "@/lib/utils";

type FilterGroupProps = {
  label: string;
  children: ReactNode;
};

function FilterGroup({ label, children }: FilterGroupProps) {
  const labelId = useId();

  return (
    <div role="group" aria-labelledby={labelId} className="flex flex-col gap-2">
      <span id={labelId} className="text-sm font-semibold text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

type ChipOptionsProps<T extends string> = {
  options: readonly T[];
  labels: Record<T, string>;
  value: T | null;
  allLabel: string;
  onChange: (value: T | null) => void;
};

function ChipOptions<T extends string>({
  options,
  labels,
  value,
  allLabel,
  onChange,
}: ChipOptionsProps<T>) {
  return (
    <>
      <Button
        variant={value === null ? "marquee" : "secondary"}
        size="chip"
        aria-pressed={value === null}
        onClick={() => onChange(null)}
      >
        {allLabel}
      </Button>
      {options.map((option) => (
        <Button
          key={option}
          variant={value === option ? "marquee" : "secondary"}
          size="chip"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          {labels[option]}
        </Button>
      ))}
    </>
  );
}

type GameFiltersProps = {
  filters: CatalogParams;
  onChange: (filters: CatalogParams) => void;
};

export function GameFilters({ filters, onChange }: GameFiltersProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const morePanelId = useId();

  return (
    <section aria-label="Filtros" className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
        <FilterGroup label="Categoría">
          <ChipOptions
            options={CATEGORIES}
            labels={CATEGORY_LABELS}
            value={filters.category}
            allLabel="Todas"
            onChange={(category) => onChange({ ...filters, category })}
          />
        </FilterGroup>
  
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-muted-foreground">Jugadores</span>
          <PlayerCountPicker />
        </div>
      </div>

      <Button
        variant="ghost"
        size="chip"
        className="self-start md:hidden"
        aria-expanded={moreOpen}
        aria-controls={morePanelId}
        onClick={() => setMoreOpen(!moreOpen)}
      >
        <SlidersHorizontal />
        {moreOpen ? "Menos filtros" : "Más filtros"}
      </Button>

      <div
        id={morePanelId}
        className={cn("flex-col gap-5 md:flex md:flex-row md:justify-between md:gap-6", moreOpen ? "flex" : "hidden")}
      >
        <FilterGroup label="Duración">
          <ChipOptions
            options={DURATION_BUCKETS}
            labels={DURATION_LABELS}
            value={filters.duration}
            allLabel="Cualquiera"
            onChange={(duration) => onChange({ ...filters, duration })}
          />
        </FilterGroup>

        <FilterGroup label="Materiales">
          <ChipOptions
            options={MATERIAL_FILTERS}
            labels={MATERIAL_FILTER_LABELS}
            value={filters.material}
            allLabel="Cualquiera"
            onChange={(material) => onChange({ ...filters, material })}
          />
        </FilterGroup>
      </div>
    </section>
  );
}
