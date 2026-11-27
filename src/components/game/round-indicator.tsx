type RoundIndicatorProps = {
  label: string;
  current: number;
  total?: number;
};

export function RoundIndicator({ label, current, total }: RoundIndicatorProps) {
  return (
    <p className="inline-flex rounded-arcade-control bg-card px-4 py-2 font-semibold arcade-edge" data-tabular>
      {label} {current}
      {total !== undefined && ` de ${total}`}
    </p>
  );
}
