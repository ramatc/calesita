import { CarouselIllustration } from "@/components/brand/carousel-illustration";
import { GameIllustration } from "@/components/brand/game-illustration";
import { CATEGORY_SURFACE } from "@/components/catalog/category-style";
import { cn } from "@/lib/utils";
import type { GameCategory, GameSlug } from "@/types/game";

type FloatingCard = {
  slug: GameSlug;
  category: GameCategory;
  placement: string;
  delay: string;
};

const FLOATING_CARDS: readonly FloatingCard[] = [
  {
    slug: "categorias-explosivas",
    category: "classic",
    placement: "bottom-[8%] -left-[3%] -rotate-12",
    delay: "-0.4s",
  },
  {
    slug: "quien-es-mas-probable-que",
    category: "social",
    placement: "top-[10%] -right-[2%] rotate-[9deg]",
    delay: "-1.5s",
  },
  {
    slug: "desafio-relampago",
    category: "physical",
    placement: "right-[1%] -bottom-[3%] rotate-6",
    delay: "-2.6s",
  },
];

type HeroStageProps = {
  className?: string;
};

/** The carousel on its lit stage, with game cards drifting around it. */
export function HeroStage({ className }: HeroStageProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-md lg:max-w-none", className)}>
      <div aria-hidden="true" className="absolute inset-[2%] rounded-full bg-card shadow-raised" />
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="absolute inset-0 size-full animate-slow-spin motion-reduce:animate-none"
      >
        <circle
          cx="50"
          cy="50"
          r="49"
          fill="none"
          stroke="var(--brand-yellow)"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeDasharray="0 5.13"
        />
      </svg>

      <div className="relative flex aspect-square items-center justify-center p-[9%]">
        <CarouselIllustration />
      </div>

      {FLOATING_CARDS.map(({ slug, category, placement, delay }) => (
        <div
          key={slug}
          aria-hidden="true"
          style={{ animationDelay: delay }}
          className={cn(
            "absolute flex aspect-[5/7] w-[25%] animate-bob items-center rounded-2xl p-[2.5%] shadow-raised motion-reduce:animate-none",
            CATEGORY_SURFACE[category],
            placement,
          )}
        >
          <GameIllustration slug={slug} className="h-auto w-full" />
        </div>
      ))}
    </div>
  );
}
