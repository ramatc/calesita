import type { ReactNode } from "react";

import { PixelLabel } from "@/components/arcade/pixel-type";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id?: string;
  title: string;
  /** A short arcade label above the title, such as "Player select". */
  eyebrow?: string;
  description?: string;
  /** A link or button aligned with the title, such as "Ver todos". */
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({
  id,
  title,
  eyebrow,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-4 gap-y-3", className)}>
      <div className="flex max-w-2xl flex-col gap-2">
        {eyebrow && <PixelLabel accent>{eyebrow}</PixelLabel>}
        <h2 id={id} className="font-display text-5xl leading-[0.9] md:text-6xl">
          {title}
        </h2>
        {description && <p className="text-lg text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
