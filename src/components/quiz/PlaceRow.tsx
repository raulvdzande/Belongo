import type { MatchedPlace } from "@/lib/match";

export function TopTenRow({ place, rank }: { place: MatchedPlace; rank: number }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-2.5">
      <span className="w-5 shrink-0 text-sm text-zinc-400 tabular-nums">{rank}</span>
      <div className="flex-1">
        <span className="font-medium text-zinc-900 dark:text-zinc-50">{place.name}</span>
        {place.parentName && (
          <span className="text-zinc-500 dark:text-zinc-400 text-sm"> · {place.parentName}</span>
        )}
      </div>
      <div className="w-24 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden hidden sm:block">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${place.matchPercent}%` }}
        />
      </div>
      <span className="w-12 text-right text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
        {place.matchPercent}%
      </span>
    </div>
  );
}
