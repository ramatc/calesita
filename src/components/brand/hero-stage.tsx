"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";

import { CarouselIllustration } from "@/components/brand/carousel-illustration";
import { CHARACTERS, getCharacterArt, getCharacterById } from "@/content/characters";
import { shuffle } from "@/lib/random";
import { cn } from "@/lib/utils";
import type { Character } from "@/types/character";

/** Full-body art shares one 260×420 canvas and ground line. */
const ART_WIDTH = 260;
const ART_HEIGHT = 420;

/** Three spots at the foot of the carousel; the middle one stands in front. */
const PLACEMENTS = ["-left-[4%] w-[30%]", "left-[34%] w-[32%] z-10", "-right-[4%] w-[30%]"] as const;

/** The trio the server renders, before the browser draws its own. */
const DEFAULT_CAST = ["pili", "rama", "chino"].flatMap((id) => getCharacterById(id) ?? []);

let drawnCast: readonly Character[] | null = null;

/** One draw per page load, so every render agrees and each visit shows a different trio. */
function getDrawnCast() {
  drawnCast ??= shuffle(CHARACTERS).slice(0, PLACEMENTS.length);
  return drawnCast;
}

const subscribe = () => () => {};

type HeroStageProps = {
  className?: string;
};

/** The carousel on its arcade stage, with three of the cast standing in front of it. */
export function HeroStage({ className }: HeroStageProps) {
  const cast = useSyncExternalStore(subscribe, getDrawnCast, () => DEFAULT_CAST);

  return (
    <div className={cn("relative mx-auto w-full max-w-72 sm:max-w-md lg:max-w-none", className)}>
      <div className="relative flex aspect-[1/0.9] items-start justify-center px-[12%] pt-[2%]">
        <CarouselIllustration className="w-full" />
      </div>

      {cast.map((character, index) => (
        <Image
          key={character.id}
          src={getCharacterArt(character, "full")}
          alt=""
          aria-hidden="true"
          width={ART_WIDTH}
          height={ART_HEIGHT}
          unoptimized
          priority
          className={cn("absolute bottom-0 h-auto", PLACEMENTS[index])}
        />
      ))}
    </div>
  );
}
