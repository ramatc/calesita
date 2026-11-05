type RoundIndicatorProps = {
  label: string;
  current: number;
  total?: number;
};

export function RoundIndicator({ label, current, total }: RoundIndicatorProps) {
  return (
    <p className="font-semibold" data-tabular>
      {label} {current}
      {total !== undefined && ` de ${total}`}
    </p>
  );
}
