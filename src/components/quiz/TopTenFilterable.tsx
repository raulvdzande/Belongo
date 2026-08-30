"use client";

import { useState } from "react";
import type { MatchedPlace } from "@/lib/match";
import { TopTenRow } from "./PlaceRow";

export function TopTenFilterable({ places }: { places: MatchedPlace[] }) {
  const [budgetOnly, setBudgetOnly] = useState(false);

  const filtered = budgetOnly
    ? places.filter((p) => (p.scores.cost_of_living ?? 0) >= 6)
    : places;

  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 print:hidden">
        <input
          type="checkbox"
          checked={budgetOnly}
          onChange={(e) => setBudgetOnly(e.target.checked)}
          className="accent-emerald-500"
        />
        Alleen betaalbare plekken tonen
      </label>
      <div className="flex flex-col gap-2">
        {filtered.map((p, i) => (
          <TopTenRow key={p.placeId} place={p} rank={i + 1} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Geen plekken in deze filter — zet de filter uit om alles te zien.
          </p>
        )}
      </div>
    </div>
  );
}
