"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";

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
  const listRef = useRef<HTMLUListElement>(null);

  // Swapping in the shuffled order makes mandatory scroll snapping follow the card it was
  // on, which opened the phone rail mid-list with a card cut off. Start at the beginning.
  useEffect(() => {
    listRef.current?.scrollTo({ left: 0 });
  }, [characters]);

  return (
    <ul ref={listRef} className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-2 overflow-x-auto px-5 pt-3 pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-7 lg:gap-1 lg:overflow-visible lg:px-0">
      {characters.map((character) => {
        const isPresent = roster.includes(character.id);

        return (
          <li key={character.id} className="w-40 shrink-0 snap-start lg:w-auto">
            <button
              type="button"
              aria-pressed={isPresent}
              onClick={() => barra.toggleCharacter(character.id)}
              className={cn(
                "group arcade-edge arcade-press block w-full cursor-pointer overflow-hidden rounded-arcade-card bg-card outline-none focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-3 focus-visible:outline-ring",
                isPresent && "border-arcade-yellow",
              )}
            >
              <span className="relative block">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 transition-opacity duration-300",
                    !isPresent && "opacity-40",
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
                    "relative h-auto w-full px-2 pt-2 transition-[translate,opacity,filter] duration-300 ease-out-expo group-hover:-translate-y-1 group-focus-visible:-translate-y-1",
                    !isPresent && "opacity-60 grayscale-[0.6]",
                  )}
                />
                {isPresent && (
                  <span
                    aria-hidden="true"
                    className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-arcade-control border-2 border-arcade-ink bg-arcade-yellow text-arcade-ink"
                  >
                    <Check className="size-5" strokeWidth={3} />
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "flex flex-col border-t-2 border-arcade-edge py-2 text-center transition-colors duration-200",
                  isPresent ? "bg-arcade-yellow text-arcade-ink" : "bg-card",
                )}
              >
                <span className="font-display text-2xl leading-none">{character.name}</span>
                <span className="pixel-label text-base opacity-80">
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
