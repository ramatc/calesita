import { cn } from "@/lib/utils";

type LogoProps = {
  /** Ink outline and flat shadow, so the yellow wordmark holds up on light surfaces. */
  outlined?: boolean;
  className?: string;
};

export function Logo({ outlined = false, className }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-block font-logo leading-none text-brand-yellow",
        outlined &&
          "[paint-order:stroke_fill] [-webkit-text-stroke:3px_var(--arcade-ink)] [text-shadow:2px_2px_0_var(--arcade-ink)]",
        className,
      )}
    >
      Calesita
    </span>
  );
}
