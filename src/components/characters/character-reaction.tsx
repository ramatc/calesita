import { CharacterAvatar } from "@/components/characters/character-avatar";
import { cn } from "@/lib/utils";
import type { Character, CharacterExpression } from "@/types/character";

export type Reaction = "victory" | "defeat" | "tie" | "celebration";

/**
 * Each reaction asks for the matching expression art, which falls back to the base
 * portrait when that variant does not exist, and moves the avatar it has.
 */
const REACTIONS: Record<Reaction, { expression: CharacterExpression; motion: string }> = {
  victory: { expression: "celebrating", motion: "motion-safe:animate-cheer" },
  celebration: { expression: "celebrating", motion: "motion-safe:animate-cheer" },
  tie: { expression: "neutral", motion: "motion-safe:animate-sway" },
  defeat: { expression: "sad", motion: "motion-safe:animate-droop" },
};

type CharacterReactionProps = {
  character: Character;
  reaction: Reaction;
  size?: "xs" | "sm" | "md" | "lg";
  /** Staggers a group, in seconds. */
  delay?: number;
  className?: string;
};

export function CharacterReaction({
  character,
  reaction,
  size = "md",
  delay = 0,
  className,
}: CharacterReactionProps) {
  const { expression, motion } = REACTIONS[reaction];

  return (
    <span
      data-reaction={reaction}
      className={cn("inline-flex", motion, reaction === "defeat" && "opacity-80", className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      <CharacterAvatar character={character} size={size} expression={expression} />
    </span>
  );
}

type CharacterReactionGroupProps = {
  characters: readonly Character[];
  reaction: Reaction;
  size?: CharacterReactionProps["size"];
  label?: string;
  className?: string;
};

/** Several characters reacting together, one after another. */
export function CharacterReactionGroup({
  characters,
  reaction,
  size = "sm",
  label,
  className,
}: CharacterReactionGroupProps) {
  if (characters.length === 0) return null;

  return (
    <span
      role="img"
      aria-label={label ?? characters.map((character) => character.name).join(", ")}
      className={cn("flex flex-wrap items-end justify-center gap-2", className)}
    >
      {characters.map((character, index) => (
        <CharacterReaction
          key={character.id}
          character={character}
          reaction={reaction}
          size={size}
          delay={0.2 + index * 0.08}
        />
      ))}
    </span>
  );
}
