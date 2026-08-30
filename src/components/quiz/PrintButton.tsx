"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full border border-zinc-200 dark:border-zinc-800 px-5 py-2.5 text-sm font-medium hover:border-zinc-300 dark:hover:border-zinc-700"
    >
      Download als PDF
    </button>
  );
}
