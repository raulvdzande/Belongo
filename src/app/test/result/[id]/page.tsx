import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export default async function TestResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testRun = await db.testRun.findUnique({
    where: { id },
    include: {
      scores: { include: { dimension: true }, orderBy: { score: "desc" } },
      dealBreakers: true,
    },
  });

  if (!testRun) notFound();

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 dark:bg-black px-4 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Bedankt! Je profiel is opgeslagen.
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Matchscherpte: {Math.round(testRun.matchPrecision * 100)}% · test-run{" "}
            <code className="text-xs">{testRun.id}</code>
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Dit is je profiel zoals opgeslagen. Klik hieronder om te zien welke landen en steden
            hier het beste bij passen.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Jouw profiel</h2>
          <div className="flex flex-col gap-1.5">
            {testRun.scores.map((s) => (
              <div key={s.id} className="flex items-center gap-3 text-sm">
                <span className="w-56 shrink-0 text-zinc-600 dark:text-zinc-400">
                  {s.dimension.name}
                </span>
                <div className="h-2 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${(s.score / 10) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right tabular-nums text-zinc-500">
                  {s.score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {testRun.dealBreakers.length > 0 && (
          <div>
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Deal-breakers & must-haves
            </h2>
            <div className="flex flex-wrap gap-2">
              {testRun.dealBreakers.map((d) => (
                <span
                  key={d.id}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    d.type === "EXCLUDE"
                      ? "border-red-500 text-red-700 dark:text-red-300"
                      : "border-emerald-500 text-emerald-700 dark:text-emerald-300"
                  }`}
                >
                  {d.type === "EXCLUDE" ? "Niet: " : "Moet: "}
                  {d.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <Link
            href={`/test/result/${id}/matches`}
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Bekijk je matches →
          </Link>
          <Link href="/test" className="text-sm text-emerald-600 hover:underline">
            Test opnieuw invullen
          </Link>
        </div>
      </div>
    </div>
  );
}
