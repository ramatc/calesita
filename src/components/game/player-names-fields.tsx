"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePersistentStore } from "@/hooks/use-persistent-store";
import { playerNamesStore } from "@/lib/player-names";

const MAX_NAME_LENGTH = 20;

type PlayerNamesFieldsProps = {
  count: number;
};

/** Optional names. Pass them to createPlayers with playerNamesStore.get() on start. */
export function PlayerNamesFields({ count }: PlayerNamesFieldsProps) {
  const names = usePersistentStore(playerNamesStore);

  function setName(index: number, name: string) {
    const next = Array.from({ length: Math.max(names.length, count) }, (_, position) =>
      position === index ? name : (names[position] ?? ""),
    );
    playerNamesStore.set(next);
  }

  return (
    <details className="rounded-2xl bg-secondary p-4">
      <summary className="cursor-pointer font-semibold">Ponerles nombre (opcional)</summary>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="flex flex-col gap-1">
            <Label htmlFor={`player-name-${index}`}>Jugador {index + 1}</Label>
            <Input
              id={`player-name-${index}`}
              className="h-11 text-base"
              maxLength={MAX_NAME_LENGTH}
              autoComplete="off"
              value={names[index] ?? ""}
              onChange={(event) => setName(index, event.target.value)}
            />
          </div>
        ))}
      </div>
    </details>
  );
}
