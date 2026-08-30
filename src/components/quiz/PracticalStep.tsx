import {
  languageLevelLabels,
  movingBudgetLabels,
  type LanguageLevel,
  type MovingBudget,
  type PracticalInput,
} from "@/lib/practical";

interface PracticalStepProps {
  value: Partial<PracticalInput>;
  onChange: (value: Partial<PracticalInput>) => void;
}

export function PracticalStep({ value, onChange }: PracticalStepProps) {
  function set<K extends keyof PracticalInput>(key: K, v: PracticalInput[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col gap-5">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Deze antwoorden maken je verhuisplan realistisch — ze bepalen bijvoorbeeld welk
        visumtraject en welk budget in je Plan A komen te staan.
      </p>

      <div>
        <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1.5">
          Nationaliteit / paspoort
        </label>
        <input
          type="text"
          placeholder="bv. Nederlands"
          value={value.nationality ?? ""}
          onChange={(e) => set("nationality", e.target.value)}
          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1.5">
          Werk je remote (locatie-onafhankelijk)?
        </label>
        <div className="flex gap-2">
          {[
            { v: true, label: "Ja" },
            { v: false, label: "Nee" },
          ].map((opt) => (
            <button
              key={String(opt.v)}
              type="button"
              onClick={() => set("remoteWork", opt.v)}
              className={`rounded-lg border px-4 py-2 text-sm ${
                value.remoteWork === opt.v
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1.5">
          Verhuis je met kinderen?
        </label>
        <div className="flex gap-2">
          {[
            { v: true, label: "Ja" },
            { v: false, label: "Nee" },
          ].map((opt) => (
            <button
              key={String(opt.v)}
              type="button"
              onClick={() => set("hasKids", opt.v)}
              className={`rounded-lg border px-4 py-2 text-sm ${
                value.hasKids === opt.v
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1.5">
          Budget voor de verhuizing zelf
        </label>
        <div className="flex flex-col gap-2">
          {(Object.keys(movingBudgetLabels) as MovingBudget[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => set("movingBudget", key)}
              className={`text-left rounded-lg border px-4 py-2 text-sm ${
                value.movingBudget === key
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {movingBudgetLabels[key]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1.5">
          Taalniveau
        </label>
        <div className="flex flex-col gap-2">
          {(Object.keys(languageLevelLabels) as LanguageLevel[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => set("languageLevel", key)}
              className={`text-left rounded-lg border px-4 py-2 text-sm ${
                value.languageLevel === key
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {languageLevelLabels[key]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
