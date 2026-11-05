import { CATEGORY_SURFACE } from "@/components/catalog/category-style";
import { cn } from "@/lib/utils";
import type { GameCategory } from "@/types/game";

type PromptCardProps = {
  /** Identifies the prompt, so the entrance replays when it changes. */
  promptId: string;
  text: string;
  category: GameCategory;
};

export function PromptCard({ promptId, text, category }: PromptCardProps) {
  return (
    <div
      key={promptId}
      className={cn(
        "flex min-h-72 flex-1 animate-deal items-center justify-center rounded-4xl p-6 text-center",
        CATEGORY_SURFACE[category],
      )}
    >
      <p aria-live="polite" className="text-3xl leading-tight font-bold text-balance md:text-5xl">
        {text}
      </p>
    </div>
  );
}
