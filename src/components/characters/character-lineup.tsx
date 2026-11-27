"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { useSyncExternalStore } from "react";

import { CHARACTERS, getCharacterArt } from "@/content/characters";
import { useParticipants } from "@/hooks/use-participants";
import { barra } from "@/lib/participants";
import { shuffle } from "@/lib/random";
import { cn } from "@/lib/utils";
import type { Character } from "@/types/character";

/** All full-body art shares one canvas and ground line, which keeps relative proportions. */
const ART_WIDTH = 260;
const ART_HEIGHT = 420;

let shuffledOrder: readonly Character[] | null = null;

/** One shuffle per page load, so every render agrees on the order. */
function getShuffledOrder() {
  shuffledOrder ??= shuffle(CHARACTERS);
  return shuffledOrder;
}

const subscribe = () => () => {};

/** The seven in their booths. Tapping one marks them present tonight. */
export function CharacterLineup() {
  // The server renders the fixed order; the browser swaps in its shuffle after hydration.
  const characters = useSyncExternalStore(subscribe, getShuffledOrder, () => CHARACTERS);
  const { roster } = useParticipants();

  return (
    <ul className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-2 overflow-x-auto px-5 pt-3 pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-7 lg:gap-1 lg:overflow-visible lg:px-0">
      {characters.map((character) => {
        const isPresent = roster.includes(character.id);

        return (
          <li key={character.id} className="w-40 shrink-0 snap-start lg:w-auto">
            <button
              type="button"
              aria-pressed={isPresent}
              onClick={() => barra.toggleCharacter(character.id)}
              className="group block w-full cursor-pointer rounded-2xl outline-none transition-transform duration-150 ease-out-expo focus-visible:ring-3 focus-visible:ring-ring active:scale-[0.97]"
            >
              <span className="relative block">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-1 top-[14%] bottom-0 rounded-t-full transition-opacity duration-300",
                    !isPresent && "opacity-35",
                  )}
                  style={{ backgroundColor: character.colors.primary }}
                />
                <Image
                  src={getCharacterArt(character, "full")}
                  alt=""
                  width={ART_WIDTH}
                  height={ART_HEIGHT}
                  unoptimized
                  className={cn(
                    "relative h-auto w-full transition-[translate,opacity,filter] duration-300 ease-out-expo group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5",
                    !isPresent && "opacity-60 grayscale-[0.6]",
                  )}
                />
                {isPresent && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1 right-2 flex size-8 items-center justify-center rounded-full bg-brand-yellow text-brand-ink shadow-card motion-safe:animate-in motion-safe:zoom-in-50"
                  >
                    <Check className="size-5" strokeWidth={3} />
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "mx-1 flex flex-col rounded-b-2xl py-2 text-center shadow-card transition-colors duration-200",
                  isPresent ? "bg-brand-yellow text-brand-ink" : "bg-card",
                )}
              >
                <span className="font-display text-lg">{character.name}</span>
                <span className="text-xs font-semibold opacity-75">
                  {isPresent ? "Presente" : "Tocá si está"}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
