import { CATEGORY_MOTIF, CATEGORY_SURFACE } from "@/components/catalog/category-style";
import { cn } from "@/lib/utils";
import type { GameCategory } from "@/types/game";

type PromptCardProps = {
  /** Identifies the prompt, so the entrance replays when it changes. */
  promptId: string;
  text: string;
  category: GameCategory;
};

/** The top card of a deck. The texture stays at the edges, so the prompt reads from across a table. */
export function PromptCard({ promptId, text, category }: PromptCardProps) {
  return (
    <div key={promptId} className="relative flex min-h-72 flex-1 animate-deal">
      <div aria-hidden="true" className="absolute inset-0 -rotate-2 rounded-4xl bg-secondary" />
      <div aria-hidden="true" className="absolute inset-0 rotate-1 rounded-4xl bg-accent" />
      <div
        className={cn(
          "relative flex flex-1 items-center justify-center overflow-hidden rounded-4xl p-8 text-center shadow-raised",
          CATEGORY_SURFACE[category],
        )}
      >
        <span aria-hidden="true" className={cn("edge-fade absolute inset-0", CATEGORY_MOTIF[category])} />
        <span
          aria-hidden="true"
          className="absolute inset-3 rounded-3xl border-2 border-brand-ink/15"
        />
        <p
          aria-live="polite"
          className="relative font-display text-[clamp(2rem,8vw,3.5rem)] leading-[1.05] text-balance"
        >
          {text}
        </p>
      </div>
    </div>
  );
}
