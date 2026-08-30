"use client";

import { useState } from "react";

/**
 * UI-only freemium gate (PROJECT.md §5): geen echte betaalprovider is
 * aangesloten in dit project (geen Stripe-oid), dus dit "ontgrendelt" alleen
 * lokaal in de browser — geen transactie, geen server-check. Duidelijk
 * gelabeld als demo zodat niemand denkt dat hier echt is afgerekend.
 */
export function PaywallGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);

  if (unlocked) return <>{children}</>;

  return (
    <div className="rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-6 text-center print:hidden">
      <p className="font-medium text-zinc-900 dark:text-zinc-50">
        Volledig rapport: Plan B & C, volledige top 10, en het complete verhuisplan
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-4">
        Demo-paywall — er is geen echte betaalprovider gekoppeld in dit project. Deze knop
        ontgrendelt alleen lokaal in je browser, er wordt niets afgeschreven.
      </p>
      <button
        type="button"
        onClick={() => setUnlocked(true)}
        className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Ontgrendel volledig rapport (demo, €9–19)
      </button>
    </div>
  );
}
