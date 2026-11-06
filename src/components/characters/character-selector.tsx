"use client";

import { ChevronDown } from "lucide-react";

import {
  CharacterAvatar,
  CharacterAvatarStack,
} from "@/components/characters/character-avatar";
import { Button } from "@/components/ui/button";
import { CHARACTERS, getCharacterById, isCharacterAvailable } from "@/content/characters";
import { usePersistentStore } from "@/hooks/use-persistent-store";
import {
  characterRosterStore,
  getEffectiveRoster,
  toggleRoster,
} from "@/lib/character-cast";
import { cn } from "@/lib/utils";
import type { Character } from "@/types/character";

type CharacterCardProps = {
  character: Character;
  /** 1-based seat, when this character is playing. */
  seat?: number;
  disabled: boolean;
  onToggle: () => void;
};

function CharacterCard({ character, seat, disabled, onToggle }: CharacterCardProps) {
  const isSelected = seat !== undefined;
  const isComingSoon = !isCharacterAvailable(character);

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={isSelected ? `${character.name}, jugador ${seat}` : character.name}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "relative flex w-[4.25rem] flex-col items-center gap-1.5 rounded-2xl pt-2 pb-1.5 outline-none transition duration-200 ease-out-expo",
        "hover:not-disabled:-translate-y-0.5 active:not-disabled:scale-[0.96] focus-visible:ring-3 focus-visible:ring-ring",
        "disabled:opacity-40",
        isSelected && "bg-card shadow-card",
      )}
    >
      <CharacterAvatar character={character} size="md" />
      <span className="max-w-full truncate text-sm font-semibold">{character.name}</span>
      {isSelected && (
        <span
          aria-hidden="true"
          data-tabular
          className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-brand-yellow text-sm font-bold text-brand-ink"
        >
          {seat}
        </span>
      )}
      {isComingSoon && <span className="text-xs text-muted-foreground">Próximamente</span>}
    </button>
  );
}

type CharacterSelectorProps = {
  /** Seats in play. Characters take them in tap order. */
  count: number;
  /** How seats map to the game, when that matters, such as teams. */
  hint?: string;
};

/** Optional and closed by default: nobody has to open it to start a game. */
export function CharacterSelector({ count, hint }: CharacterSelectorProps) {
  const roster = usePersistentStore(characterRosterStore);
  const seats = getEffectiveRoster(roster, count);
  const isFull = seats.length === count;
  const chosen = seats.flatMap((id) => getCharacterById(id) ?? []);

  return (
    <details className="group rounded-2xl bg-secondary px-4 py-1.5">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 py-1 font-semibold [&::-webkit-details-marker]:hidden">
        <span className="mr-auto">Elegir personajes (opcional)</span>
        <CharacterAvatarStack characters={chosen} className="group-open:hidden" />
        <ChevronDown
          aria-hidden
          className="size-5 shrink-0 transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="flex flex-col gap-3 pt-2 pb-2.5">
        <p className="text-muted-foreground">
          {isFull
            ? "Ya están todos los lugares ocupados."
            : "Tocá quién juega. El orden es el de los turnos."}
          {hint && ` ${hint}`}
        </p>
        <ul className="flex flex-wrap justify-center gap-1">
          {CHARACTERS.map((character) => {
            const seatIndex = seats.indexOf(character.id);
            const isSelected = seatIndex >= 0;
            const isBlocked = !isCharacterAvailable(character) || (isFull && !isSelected);

            return (
              <li key={character.id}>
                <CharacterCard
                  character={character}
                  seat={isSelected ? seatIndex + 1 : undefined}
                  disabled={isBlocked}
                  onToggle={() =>
                    characterRosterStore.set(toggleRoster(roster, character.id, count))
                  }
                />
              </li>
            );
          })}
        </ul>
        {roster.length > 0 && (
          <Button
            variant="ghost"
            size="chip"
            className="self-center"
            onClick={() => characterRosterStore.set([])}
          >
            Jugar sin personajes
          </Button>
        )}
      </div>
    </details>
  );
}
