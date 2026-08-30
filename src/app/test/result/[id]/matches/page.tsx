import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { computeMatches, type MatchedPlace } from "@/lib/match";
import { generateRelocationPlan } from "@/lib/relocationPlan";
import { ShareButton } from "@/components/quiz/ShareButton";
import { PrintButton } from "@/components/quiz/PrintButton";
import { PaywallGate } from "@/components/quiz/PaywallGate";
import { Checklist } from "@/components/quiz/Checklist";
import { TopTenFilterable } from "@/components/quiz/TopTenFilterable";
import { TopTenRow } from "@/components/quiz/PlaceRow";

function placeLabel(place: MatchedPlace) {
  return place.parentName ? `${place.name}, ${place.parentName}` : place.name;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { planA } = await computeMatches(id, { persist: false });
  const title = planA
    ? `Mijn perfecte plek: ${placeLabel(planA)} (${planA.matchPercent}% match) — Belongo`
    : "Mijn Belongo-resultaat";
  return {
    title,
    description: "Bekijk mijn Plan A, B, C en top 10 op Belongo.",
    openGraph: { title },
  };
}

function ReasonsList({ reasons }: { reasons: MatchedPlace["reasons"] }) {
  if (reasons.length === 0) return null;
  return (
    <ul className="flex flex-col gap-1.5 mt-3">
      {reasons.map((r) => (
        <li key={r.dimensionName} className="text-sm text-zinc-600 dark:text-zinc-400">
          <span className="text-emerald-600 dark:text-emerald-400">✓</span> {r.dimensionName}{" "}
          <span className="text-zinc-400 dark:text-zinc-500">
            (jij wilde {r.userScore.toFixed(1)}, deze plek scoort {r.placeScore.toFixed(1)})
          </span>
        </li>
      ))}
    </ul>
  );
}

const affiliateCategories = [
  { emoji: "🏠", label: "Woningplatforms (huur/koop internationaal)" },
  { emoji: "✈️", label: "Vliegtickets & internationale verhuisbedrijven" },
  { emoji: "📄", label: "Visum-/immigratiediensten" },
  { emoji: "🩺", label: "Expat-zorgverzekeringen & internationale banken" },
  { emoji: "🗣️", label: "Taalcursussen" },
  { emoji: "🧳", label: "Reisverzekeringen" },
];

export default async function MatchesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testRun = await db.testRun.findUnique({ where: { id } });
  if (!testRun) notFound();

  const { planA, planB, planC, top10, excludedCount, consideredCount } = await computeMatches(id);
  const planALabel = planA ? placeLabel(planA) : null;

  const plan =
    planA &&
    generateRelocationPlan({
      placeName: planA.name,
      parentName: planA.parentName,
      countryCode: planA.countryCode,
      scores: planA.scores,
      practical: {
        nationality: testRun.nationality ?? undefined,
        remoteWork: testRun.remoteWork ?? undefined,
        hasKids: testRun.hasKids ?? undefined,
        movingBudget: testRun.movingBudget ?? undefined,
        languageLevel: testRun.languageLevel ?? undefined,
      },
    });

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 dark:bg-black px-4 py-12 print:bg-white">
      <div className="w-full max-w-2xl flex flex-col gap-10">
        <div className="flex items-start justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Jouw matches
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {consideredCount} plekken meegenomen, {excludedCount} uitgesloten door harde
              filters (budget, visum, deal-breakers).
            </p>
          </div>
          <div className="flex gap-2">
            <ShareButton />
            <PrintButton />
          </div>
        </div>

        {!planA && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Geen enkele plek voldoet aan je harde eisen — probeer wat minder strikte
            deal-breakers.
          </p>
        )}

        {planA && (
          <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                🏆 Plan A — jouw perfecte plek
              </span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {planA.matchPercent}%
              </span>
            </div>
            <h2 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mt-2">
              {placeLabel(planA)}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Waarom dit past:</p>
            <ReasonsList reasons={planA.reasons} />
          </div>
        )}

        {!planA && top10.length === 0 && (
          <div>
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
              Gratis: top 3 landen
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Geen resultaten.</p>
          </div>
        )}

        {top10.length > 0 && (
          <div className="print:hidden">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
              Gratis: top 3 (korte teaser)
            </h2>
            <div className="flex flex-col gap-2">
              {top10.slice(0, 3).map((p, i) => (
                <TopTenRow key={p.placeId} place={p} rank={i + 1} />
              ))}
            </div>
          </div>
        )}

        <PaywallGate>
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {planB && (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      🥈 Plan B — haalbare optie
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {planB.matchPercent}%
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mt-1">
                    {placeLabel(planB)}
                  </h3>
                  <ReasonsList reasons={planB.reasons.slice(0, 2)} />
                </div>
              )}

              {planC && (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      🥉 Plan C — de wildcard
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {planC.matchPercent}%
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mt-1">
                    {placeLabel(planC)}
                  </h3>
                  <ReasonsList reasons={planC.reasons.slice(0, 2)} />
                </div>
              )}
            </div>

            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3">📊 Top 10</h2>
              <TopTenFilterable places={top10} />
            </div>

            {plan && (
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                  📄 Volledig verhuisplan naar {planALabel}
                </h2>
                <div className="flex flex-col gap-5">
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                      Visum & verblijfsrecht
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{plan.visa}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">Budget</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{plan.budget}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                      Tijdlijn
                    </h3>
                    <div className="flex flex-col gap-2">
                      {plan.timeline.map((m) => (
                        <div key={m.month} className="text-sm">
                          <span className="font-medium text-zinc-900 dark:text-zinc-50">
                            {m.month}:{" "}
                          </span>
                          <span className="text-zinc-600 dark:text-zinc-400">
                            {m.steps.join(" · ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">Wonen</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{plan.housing}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">Werk</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{plan.work}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                      Praktische zaken
                    </h3>
                    <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400 flex flex-col gap-0.5">
                      {plan.practical.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                      Checklist
                    </h3>
                    <Checklist testRunId={id} items={plan.checklist} />
                  </div>
                </div>
              </div>
            )}

            <div className="print:hidden">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                Aanbevolen diensten
              </h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3">
                Nog geen affiliate-partners aangesloten — placeholders voor waar dat straks komt.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {affiliateCategories.map((c) => (
                  <div
                    key={c.label}
                    className="rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400"
                  >
                    {c.emoji} {c.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PaywallGate>

        <Link
          href={`/test/result/${id}`}
          className="text-sm text-emerald-600 hover:underline print:hidden"
        >
          ← Terug naar je profiel
        </Link>
      </div>
    </div>
  );
}
