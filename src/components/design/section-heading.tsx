import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id?: string;
  title: string;
  description?: string;
  /** A link or button aligned with the title, such as "Ver todos". */
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({ id, title, description, action, className }: SectionHeadingProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="flex max-w-2xl flex-col gap-2">
        <h2 id={id} className="font-display text-4xl leading-none md:text-5xl">
          {title}
        </h2>
        {description && <p className="text-lg text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
