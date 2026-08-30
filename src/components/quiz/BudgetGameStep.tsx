import { BUDGET_TOTAL, budgetCategories } from "@/lib/budgetGame";

interface BudgetGameStepProps {
  allocation: Record<string, number>;
  onChange: (allocation: Record<string, number>) => void;
}

export function BudgetGameStep({ allocation, onChange }: BudgetGameStepProps) {
  const total = budgetCategories.reduce((sum, c) => sum + (allocation[c.key] ?? 0), 0);

  function setValue(key: string, value: number) {
    onChange({ ...allocation, [key]: value });
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
      <p className="font-medium text-zinc-900 dark:text-zinc-50 mb-1">
        Je hebt een fictief maandbudget van 100 punten. Verdeel het over deze categorieën zoals jij
        het écht zou uitgeven.
      </p>
      <p
        className={`text-sm mb-4 ${
          total === BUDGET_TOTAL
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-amber-600 dark:text-amber-400"
        }`}
      >
        Totaal verdeeld: {total} / {BUDGET_TOTAL}
        {total !== BUDGET_TOTAL && " — verdeel exact 100 punten om verder te gaan"}
      </p>

      <div className="flex flex-col gap-4">
        {budgetCategories.map((cat) => (
          <div key={cat.key}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>
                {cat.emoji} {cat.label}
              </span>
              <span className="tabular-nums text-zinc-500 dark:text-zinc-400">
                {allocation[cat.key] ?? 0}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              step={5}
              value={allocation[cat.key] ?? 0}
              onChange={(e) => setValue(cat.key, Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
