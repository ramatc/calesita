"use client";

import { Users } from "lucide-react";

import { PlayerCountPicker } from "@/components/catalog/player-count-picker";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePersistentStore } from "@/hooks/use-persistent-store";
import { playerCountStore } from "@/lib/player-count";

/** The navbar's compact entry to the group size; the picker keeps the rules. */
export function PlayerSelector() {
  const players = usePersistentStore(playerCountStore);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="chip"
          aria-label={
            players === null
              ? "Elegir cantidad de jugadores"
              : `Cambiar cantidad de jugadores: ${players}`
          }
        >
          <Users />
          <span data-tabular className="font-semibold">
            {players ?? "¿Cuántos?"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PlayerCountPicker />
      </PopoverContent>
    </Popover>
  );
}
