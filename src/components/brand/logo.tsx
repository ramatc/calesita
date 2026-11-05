import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-block font-logo leading-none text-brand-yellow",
        className,
      )}
    >
      Calesita
    </span>
  );
}
