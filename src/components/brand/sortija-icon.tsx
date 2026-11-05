type SortijaIconProps = {
  className?: string;
};

/** The ring riders reach for on a calesita. */
export function SortijaIcon({ className }: SortijaIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="14" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="m12 2 3 4-3 3-3-3Z" fill="currentColor" />
    </svg>
  );
}
