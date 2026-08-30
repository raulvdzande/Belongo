import { useState } from "react";
import { excludeOptions, requireOptions, type SelectedDealBreaker } from "@/lib/dealBreakers";

interface DealBreakersStepProps {
  selected: SelectedDealBreaker[];
  onChange: (selected: SelectedDealBreaker[]) => void;
}

const curatedLabels = new Set([
  ...excludeOptions.map((o) => o.label),
  ...requireOptions.map((o) => o.label),
]);

export function DealBreakersStep({ selected, onChange }: DealBreakersStepProps) {
  const [customLabel, setCustomLabel] = useState("");

  const isChecked = (label: string) => selected.some((s) => s.label === label);
  const customSelected = selected.filter((s) => !curatedLabels.has(s.label));

  function toggle(label: string, type: "EXCLUDE" | "REQUIRE") {
    if (isChecked(label)) {
      onChange(selected.filter((s) => s.label !== label));
    } else {
      onChange([...selected, { label, type }]);
    }
  }

  function addCustom(type: "EXCLUDE" | "REQUIRE") {
    const label = customLabel.trim();
    if (!label || isChecked(label)) return;
    onChange([...selected, { label, type }]);
    setCustomLabel("");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
          Wat mag absoluut NIET?
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          Deal-breakers: plekken die hierop scoren worden direct uitgesloten.
        </p>
        <div className="flex flex-wrap gap-2">
          {excludeOptions.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => toggle(opt.label, "EXCLUDE")}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                isChecked(opt.label)
                  ? "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            placeholder="Eigen deal-breaker toevoegen..."
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={() => addCustom("EXCLUDE")}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-sm hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            Toevoegen
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
          Wat is een absolute EIS?
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          Must-haves: plekken zonder dit worden direct uitgesloten.
        </p>
        <div className="flex flex-wrap gap-2">
          {requireOptions.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => toggle(opt.label, "REQUIRE")}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                isChecked(opt.label)
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            placeholder="Eigen eis toevoegen..."
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={() => addCustom("REQUIRE")}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-sm hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            Toevoegen
          </button>
        </div>
      </div>

      {customSelected.length > 0 && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          ⚠ Eigen toevoegingen ({customSelected.map((s) => s.label).join(", ")}) worden bewaard
          bij je profiel, maar kunnen nog niet automatisch worden gecontroleerd tegen elke plek —
          alleen de knoppen hierboven filteren echt.
        </p>
      )}
    </div>
  );
}
