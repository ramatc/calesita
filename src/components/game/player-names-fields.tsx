"use client";

import { ChevronDown } from "lucide-react";

import { CharacterAvatar } from "@/components/characters/character-avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCharacterById } from "@/content/characters";
import { usePersistentStore } from "@/hooks/use-persistent-store";
import { characterRosterStore, getEffectiveRoster } from "@/lib/character-cast";
import { playerNamesStore } from "@/lib/player-names";

const MAX_NAME_LENGTH = 20;

type PlayerNamesFieldsProps = {
  count: number;
};

/** Optional names. Pass them to createPlayers with playerNamesStore.get() on start. */
export function PlayerNamesFields({ count }: PlayerNamesFieldsProps) {
  const names = usePersistentStore(playerNamesStore);
  const roster = getEffectiveRoster(usePersistentStore(characterRosterStore), count);

  function setName(index: number, name: string) {
    const next = Array.from({ length: Math.max(names.length, count) }, (_, position) =>
      position === index ? name : (names[position] ?? ""),
    );
    playerNamesStore.set(next);
  }

  return (
    <details className="group rounded-2xl bg-secondary px-4 py-1.5">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 py-1 font-semibold [&::-webkit-details-marker]:hidden">
        Ponerles nombre (opcional)
        <ChevronDown
          aria-hidden
          className="size-5 shrink-0 transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="mt-2 mb-2.5 grid gap-3 sm:grid-cols-2">
        {Array.from({ length: count }, (_, index) => {
          const character = getCharacterById(roster[index] ?? "");

          return character ? (
            <div key={index} className="flex flex-col gap-1">
              <span className="text-sm font-medium">Jugador {index + 1}</span>
              <span className="flex h-11 items-center gap-2 font-semibold">
                <CharacterAvatar character={character} size="xs" />
                {character.name}
              </span>
            </div>
          ) : (
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
          );
        })}
      </div>
    </details>
  );
}
