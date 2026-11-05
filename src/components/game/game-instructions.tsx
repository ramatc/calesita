type GameInstructionsProps = {
  rules: readonly string[];
};

export function GameInstructions({ rules }: GameInstructionsProps) {
  return (
    <section aria-labelledby="rules-heading" className="rounded-3xl bg-card p-5">
      <h2 id="rules-heading" className="text-lg font-bold">
        Cómo se juega
      </h2>
      <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 marker:font-bold marker:text-brand-yellow">
        {rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ol>
    </section>
  );
}
