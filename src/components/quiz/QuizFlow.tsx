"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { allQuestions, categories } from "@/lib/questions";
import type { SelectedDealBreaker } from "@/lib/dealBreakers";
import type { PracticalInput } from "@/lib/practical";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { DealBreakersStep } from "./DealBreakersStep";
import { BudgetGameStep } from "./BudgetGameStep";
import { PracticalStep } from "./PracticalStep";
import { submitTestRun } from "@/app/test/actions";

type StepDef =
  | { kind: "category"; category: string; label: string }
  | { kind: "budgetgame"; label: string }
  | { kind: "dealbreakers"; label: string }
  | { kind: "practical"; label: string };

const STEPS: StepDef[] = [
  ...categories.map((c): StepDef => ({ kind: "category", category: c, label: c })),
  { kind: "category", category: "Beeld & gevoel", label: "Deel 2 — Beeld & gevoel" },
  { kind: "budgetgame", label: "Deel 3 — Budget-verdeelspel" },
  { kind: "dealbreakers", label: "Deel 4 — Deal-breakers & must-haves" },
  { kind: "category", category: "Dilemma's", label: "Deel 5 — Dilemma's" },
  {
    kind: "category",
    category: "Een dag uit je ideale leven",
    label: "Deel 6 — Een dag uit je ideale leven",
  },
  { kind: "practical", label: "Deel 7 — Praktische situatie" },
];

const TOTAL_STEPS = STEPS.length;

export function QuizFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [dealBreakers, setDealBreakers] = useState<SelectedDealBreaker[]>([]);
  const [budgetAllocation, setBudgetAllocation] = useState<Record<string, number>>({});
  const [practical, setPractical] = useState<Partial<PracticalInput>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = STEPS[step];
  const currentQuestions = useMemo(
    () =>
      current.kind === "category"
        ? allQuestions.filter((q) => q.category === current.category)
        : [],
    [current]
  );

  const answeredCount = Object.keys(answers).length;

  const budgetTotal = Object.values(budgetAllocation).reduce((a, b) => a + b, 0);
  const practicalComplete =
    !!practical.nationality?.trim() &&
    practical.remoteWork !== undefined &&
    practical.hasKids !== undefined &&
    !!practical.movingBudget &&
    !!practical.languageLevel;

  const stepComplete =
    current.kind === "category"
      ? currentQuestions.every((q) => answers[q.id] !== undefined)
      : current.kind === "budgetgame"
        ? budgetTotal === 100
        : current.kind === "practical"
          ? practicalComplete
          : true; // dealbreakers: optioneel

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const result = await submitTestRun({
        answers,
        dealBreakers,
        budgetAllocation,
        practical: practical as PracticalInput,
      });
      router.push(`/test/result/${result.testRunId}`);
    } catch {
      setError("Er ging iets mis bij het opslaan. Probeer het nog eens.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <ProgressBar current={answeredCount} total={allQuestions.length} label={current.label} />

      {current.kind === "category" && (
        <div className="flex flex-col gap-4">
          {currentQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              value={answers[q.id]}
              onChange={(value) => setAnswers((prev) => ({ ...prev, [q.id]: value }))}
            />
          ))}
        </div>
      )}

      {current.kind === "budgetgame" && (
        <BudgetGameStep allocation={budgetAllocation} onChange={setBudgetAllocation} />
      )}

      {current.kind === "dealbreakers" && (
        <DealBreakersStep selected={dealBreakers} onChange={setDealBreakers} />
      )}

      {current.kind === "practical" && (
        <PracticalStep value={practical} onChange={setPractical} />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm disabled:opacity-40"
        >
          Vorige
        </button>

        <span className="text-xs text-zinc-400">
          Stap {step + 1} van {TOTAL_STEPS}
        </span>

        {step < TOTAL_STEPS - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!stepComplete}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            Volgende
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !stepComplete}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {submitting ? "Bezig..." : "Test afronden"}
          </button>
        )}
      </div>
    </div>
  );
}
