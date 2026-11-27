import * as React from "react"
import { cn } from "cn"

/** The arcade field: hard ink edge, raised fill, 48px tall for touch. */
const ARCADE_INPUT =
  "h-12 rounded-arcade-control border-2 border-arcade-edge bg-arcade-raised px-3 font-ui text-base text-arcade-text placeholder:text-arcade-muted shadow-arcade-sm focus-visible:border-arcade-edge focus-visible:ring-0 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring md:text-base dark:bg-arcade-raised"

function Input({
  className,
  type,
  variant = "default",
  ...props
}: React.ComponentProps<"input"> & { variant?: "default" | "arcade" }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        variant === "arcade" && ARCADE_INPUT,
        className
      )}
      {...props}
    />
  )
}

export { Input }
