"use client";

import { useState } from "react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — fall back to a manual copy hint
      window.prompt("Kopieer deze link:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="rounded-full border border-zinc-200 dark:border-zinc-800 px-5 py-2.5 text-sm font-medium hover:border-zinc-300 dark:hover:border-zinc-700"
    >
      {copied ? "Link gekopieerd!" : "Deel dit resultaat"}
    </button>
  );
}
