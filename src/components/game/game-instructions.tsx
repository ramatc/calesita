type GameInstructionsProps = {
  rules: readonly string[];
};

export function GameInstructions({ rules }: GameInstructionsProps) {
  return (
    <section aria-labelledby="rules-heading" className="arcade-edge rounded-arcade-card bg-card p-5">
      <h2 id="rules-heading" className="font-display text-4xl leading-none">
        Cómo se juega
      </h2>
      <ol className="mt-4 flex flex-col gap-3">
        {rules.map((rule, index) => (
          <li key={rule} className="flex gap-3">
            <span
              aria-hidden="true"
              className="flex size-7 shrink-0 items-center justify-center rounded-arcade-control border-2 border-arcade-ink bg-arcade-yellow font-display text-xl leading-none text-arcade-ink"
              data-tabular
            >
              {index + 1}
            </span>
            <span className="pt-0.5">{rule}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
