"use client";

import { useEffect, useState } from "react";
import type { ChecklistItem } from "@/lib/relocationPlan";

export function Checklist({ testRunId, items }: { testRunId: string; items: ChecklistItem[] }) {
  const storageKey = `belongo:checklist:${testRunId}`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      // One-time hydrate from localStorage on mount; no external-store API for this.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      // localStorage onbeschikbaar (privémodus e.d.) — checklist werkt dan alleen deze sessie
    }
  }, [storageKey]);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // negeren
      }
      return next;
    });
  }

  const doneCount = items.filter((i) => checked[i.id]).length;

  return (
    <div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
        {doneCount} / {items.length} afgevinkt
      </p>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!checked[item.id]}
                onChange={() => toggle(item.id)}
                className="accent-emerald-500"
              />
              <span className={checked[item.id] ? "line-through text-zinc-400" : ""}>
                {item.label}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
