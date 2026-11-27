import Image from "next/image";

import { getCharacterArt } from "@/content/characters";
import { cn } from "@/lib/utils";
import type { Character } from "@/types/character";

type CharacterCameoProps = {
  character: Character;
  text: string;
  /** Where the bubble sits relative to the character. */
  side?: "left" | "right";
  /** On phones the cameo stays still; motion starts at the md breakpoint. */
  className?: string;
};

/**
 * A character peeking out of a slot with a short line. It reuses the original portrait,
 * moves only with CSS, and holds no focusable content.
 */
export function CharacterCameo({ character, text, side = "left", className }: CharacterCameoProps) {
  return (
    <div
      className={cn(
        "pointer-events-none flex items-end gap-2 md:motion-safe:animate-peek",
        side === "left" ? "flex-row" : "flex-row-reverse",
        className,
      )}
    >
      <p className="arcade-edge max-w-52 rounded-arcade-card bg-card px-3 py-2 text-sm leading-snug font-semibold text-card-foreground">
        {text}
      </p>
      <span
        className="arcade-edge relative size-16 shrink-0 origin-bottom overflow-hidden rounded-arcade-card md:motion-safe:animate-wave"
        style={{ backgroundColor: character.colors.primary }}
      >
        <Image
          src={getCharacterArt(character, "portrait")}
          alt=""
          width={64}
          height={64}
          unoptimized
          className="size-full object-cover"
        />
      </span>
    </div>
  );
}
