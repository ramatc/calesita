"use client";

import Image from "next/image";
import { useState } from "react";

import { getCharacterArt } from "@/content/characters";
import { cn } from "@/lib/utils";
import type { Character, CharacterExpression } from "@/types/character";

const SIZES = {
  xs: { box: "size-8 ring-2", pixels: 32, letter: "text-base" },
  sm: { box: "size-11 ring-2", pixels: 44, letter: "text-xl" },
  md: { box: "size-16 ring-3", pixels: 64, letter: "text-3xl" },
  lg: { box: "size-24 ring-4", pixels: 96, letter: "text-5xl" },
} as const;

type CharacterAvatarProps = {
  character: Character;
  size?: keyof typeof SIZES;
  expression?: CharacterExpression;
  /** Leave false when the name is already next to the avatar, so it is not read twice. */
  labelled?: boolean;
  className?: string;
};

/** A character on its color. Missing art shows the initial, never a broken image. */
export function CharacterAvatar({
  character,
  size = "md",
  expression = "neutral",
  labelled = false,
  className,
}: CharacterAvatarProps) {
  const { box, pixels, letter } = SIZES[size];
  const src = getCharacterArt(character, "portrait", expression);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        box,
        className,
      )}
      style={{
        backgroundColor: character.colors.primary,
        ["--tw-ring-color" as string]: character.colors.secondary,
      }}
    >
      {failedSrc === src ? (
        <span aria-hidden={!labelled} className={cn("font-display text-brand-ink", letter)}>
          {character.name.charAt(0)}
        </span>
      ) : (
        <Image
          src={src}
          alt={labelled ? character.name : ""}
          width={pixels}
          height={pixels}
          unoptimized
          className="size-full object-cover"
          onError={() => setFailedSrc(src)}
        />
      )}
    </span>
  );
}

type CharacterAvatarStackProps = {
  characters: readonly Character[];
  size?: keyof typeof SIZES;
  className?: string;
};

/** Everyone in a group, with their names for assistive tech. */
export function CharacterAvatarStack({
  characters,
  size = "xs",
  className,
}: CharacterAvatarStackProps) {
  if (characters.length === 0) return null;

  return (
    <span
      role="img"
      aria-label={characters.map((character) => character.name).join(", ")}
      className={cn("inline-flex shrink-0 items-center -space-x-2", className)}
    >
      {characters.map((character) => (
        <CharacterAvatar key={character.id} character={character} size={size} />
      ))}
    </span>
  );
}
