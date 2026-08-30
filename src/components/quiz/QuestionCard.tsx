import { LIKERT_LABELS, type Question } from "@/lib/questions";

interface QuestionCardProps {
  question: Question;
  value: number | undefined;
  onChange: (value: number) => void;
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
      <p className="font-medium text-zinc-900 dark:text-zinc-50 mb-4">{question.text}</p>

      {question.type === "slider" && (
        <div>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={value ?? 5}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            <span className="max-w-[45%]">{question.minLabel}</span>
            <span className="max-w-[45%] text-right">{question.maxLabel}</span>
          </div>
        </div>
      )}

      {question.type === "choice" && (
        <div className="flex flex-col gap-2">
          {question.options.map((opt, i) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => onChange(i)}
              className={`text-left rounded-lg border px-4 py-2 text-sm transition-colors ${
                value === i
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {question.type === "statement" && (
        <div className="flex flex-wrap gap-2">
          {LIKERT_LABELS.map((label, i) => {
            const likertValue = i + 1;
            return (
              <button
                key={label}
                type="button"
                onClick={() => onChange(likertValue)}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                  value === likertValue
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
