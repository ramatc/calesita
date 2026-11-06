import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type DisclosureProps = {
  summary: string;
  children: ReactNode;
};

/** Secondary information during a game: closed by default, so controls stay in view. */
export function Disclosure({ summary, children }: DisclosureProps) {
  return (
    <details className="group">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center gap-2 font-semibold [&::-webkit-details-marker]:hidden">
        {summary}
        <ChevronDown aria-hidden className="size-5 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}
