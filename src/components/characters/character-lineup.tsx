import Image from "next/image";

import { CHARACTERS, getCharacterArt } from "@/content/characters";

/** All full-body art shares one canvas and ground line, which keeps relative proportions. */
const ART_WIDTH = 260;
const ART_HEIGHT = 420;

/** The seven in their booths, as a decorative piece of the home. */
export function CharacterLineup() {
  return (
    <ul className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-2 overflow-x-auto px-5 pt-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-7 lg:gap-1 lg:overflow-visible lg:px-0">
      {CHARACTERS.map((character) => (
        <li key={character.id} className="group w-40 shrink-0 snap-start lg:w-auto">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-x-1 top-[14%] bottom-0 rounded-t-full"
              style={{ backgroundColor: character.colors.primary }}
            />
            <Image
              src={getCharacterArt(character, "full")}
              alt=""
              width={ART_WIDTH}
              height={ART_HEIGHT}
              unoptimized
              className="relative h-auto w-full transition-transform duration-300 ease-out-expo group-hover:-translate-y-1.5"
            />
          </div>
          <p className="mx-1 rounded-b-2xl bg-card py-2 text-center font-display text-lg shadow-card">
            {character.name}
          </p>
        </li>
      ))}
    </ul>
  );
}
