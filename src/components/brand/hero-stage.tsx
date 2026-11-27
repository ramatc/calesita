import Image from "next/image";

import { CarouselIllustration } from "@/components/brand/carousel-illustration";
import { CHARACTERS, getCharacterArt } from "@/content/characters";
import { cn } from "@/lib/utils";

/** Full-body art shares one 260×420 canvas and ground line. */
const ART_WIDTH = 260;
const ART_HEIGHT = 420;

/** Three of the cast stand at the foot of the carousel; the rest of the barra lives below. */
const STAGE_CAST = [
  { id: "pili", placement: "-left-[4%] w-[30%]" },
  { id: "rama", placement: "left-[34%] w-[32%] z-10" },
  { id: "chino", placement: "-right-[4%] w-[30%]" },
] as const;

type HeroStageProps = {
  className?: string;
};

/** The carousel on its arcade stage, with part of the cast standing in front of it. */
export function HeroStage({ className }: HeroStageProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-72 sm:max-w-md lg:max-w-none", className)}>
      <div className="relative flex aspect-[1/0.9] items-start justify-center px-[12%] pt-[2%]">
        <CarouselIllustration className="w-full" />
      </div>

      {STAGE_CAST.map(({ id, placement }) => {
        const character = CHARACTERS.find((candidate) => candidate.id === id);
        if (!character) return null;

        return (
          <Image
            key={id}
            src={getCharacterArt(character, "full")}
            alt=""
            aria-hidden="true"
            width={ART_WIDTH}
            height={ART_HEIGHT}
            unoptimized
            priority
            className={cn("absolute bottom-0 h-auto", placement)}
          />
        );
      })}
    </div>
  );
}
