import { db } from "./db";
import type { PlaceLevel } from "@/generated/prisma/client";

// ---------------------------------------------------------------------
// Laag 2 — Harde filters (PROJECT.md §3)
// ---------------------------------------------------------------------
// Elke curated deal-breaker/must-have (zie src/lib/dealBreakers.ts) wordt
// hier vertaald naar een concrete regel op de dimensie-scores van een plek.
// Vrij ingetypte deal-breakers kunnen niet automatisch vertaald worden en
// worden dus NIET hard gefilterd — dat is een bewuste MVP-beperking, geen
// bug (zie docs/dimensions.md voor het voorbehoud bij de dataset zelf).

export type PlaceScores = Record<string, number>;

/**
 * Landlocked landen in de dataset (ISO2) — gebruikt voor een échte "zee/kust
 * dichtbij"-toets in plaats van de vorige nature_landscape-proxy, die
 * bijvoorbeeld het landlocked Servië ten onrechte liet passeren.
 */
const LANDLOCKED_COUNTRIES = new Set([
  "LU", "AT", "CH", "LI", "AD", "SM", "VA", "CZ", "SK", "HU", "RS", "MK", "XK", "MD", "BY",
]);

const DEALBREAKER_RULES: Record<string, (s: PlaceScores) => boolean> = {
  "Geen sneeuw / winterkou": (s) => (s.climate ?? 5) < 4,
  "Geen extreme hitte": (s) => (s.climate ?? 5) > 9,
  "Geen politieke instabiliteit": (s) => (s.politics_freedom ?? 5) < 5,
  "Geen ingewikkeld of onzeker visumtraject": (s) => (s.tax_visa ?? 5) < 5,
  "Geen hoge criminaliteit": (s) => (s.safety ?? 5) < 5,
  "Geen slechte internetverbinding": (s) => (s.internet_infra ?? 5) < 5,
  "Goede internationale/Engelstalige scholen": (s) =>
    (s.education ?? 5) < 6 || (s.language ?? 5) < 6,
  "Legale verblijfsstatus/visum haalbaar voor mij": (s) => (s.tax_visa ?? 5) < 5,
  "Goede toegang tot gezondheidszorg": (s) => (s.healthcare ?? 5) < 6,
  // Geen data om dit te toetsen (huisdierregels, vliegveldafstand) — geen filter.
};

/** true = plek wordt uitgesloten */
export function violatesDealBreakers(
  scores: PlaceScores,
  countryCode: string,
  dealBreakers: { label: string; type: "EXCLUDE" | "REQUIRE" }[]
): boolean {
  return dealBreakers.some((db_) => {
    if (db_.label === "Zee of kust dichtbij") return LANDLOCKED_COUNTRIES.has(countryCode);
    const rule = DEALBREAKER_RULES[db_.label];
    return rule ? rule(scores) : false;
  });
}

/**
 * Budget/visum harde afsluiting op basis van het profiel zelf (los van
 * expliciete deal-breakers): een gebruiker die aangeeft een krap budget of
 * een makkelijk visumtraject nodig te hebben, sluit plekken uit die daar
 * duidelijk niet aan voldoen.
 */
export function violatesBudgetOrVisa(scores: PlaceScores, profile: PlaceScores): boolean {
  if ((profile.cost_of_living ?? 5) >= 7 && (scores.cost_of_living ?? 5) < 5) return true;
  if ((profile.tax_visa ?? 5) >= 7 && (scores.tax_visa ?? 5) < 5) return true;
  return false;
}

// ---------------------------------------------------------------------
// Laag 3 — Matchscore (gewogen afstand tussen profiel en plek)
// ---------------------------------------------------------------------

export interface ProfileDimension {
  dimensionKey: string;
  score: number;
  weight: number;
}

/** 0-100: hoe dichter de gewogen afstand bij 0, hoe hoger de match. */
export function matchPercent(profile: ProfileDimension[], place: PlaceScores): number {
  let weightedDiffSum = 0;
  let weightSum = 0;
  for (const p of profile) {
    const placeScore = place[p.dimensionKey];
    if (placeScore === undefined) continue; // niet plek-scoorbaar (bv. future_ambitions)
    weightedDiffSum += Math.abs(p.score - placeScore) * p.weight;
    weightSum += p.weight;
  }
  if (weightSum === 0) return 0;
  const avgWeightedDiff = weightedDiffSum / weightSum; // 0-10
  return Math.round((1 - avgWeightedDiff / 10) * 100);
}

// ---------------------------------------------------------------------
// Orchestratie: profiel ophalen, filteren, scoren, Plan A/B/C + top 10
// ---------------------------------------------------------------------

export interface MatchReason {
  dimensionName: string;
  userScore: number;
  placeScore: number;
}

export interface MatchedPlace {
  placeId: string;
  name: string;
  level: PlaceLevel;
  countryCode: string;
  parentName: string | null;
  matchPercent: number;
  /** Top dimensies die het meest bijdragen aan de match (belangrijk voor gebruiker + goede fit). */
  reasons: MatchReason[];
  /** Ruwe dimensie-scores van deze plek (voor bv. het verhuisplan). */
  scores: PlaceScores;
}

/**
 * Rangschikt dimensies op "belangrijk voor de gebruiker" x "goede fit met de
 * plek" — dit vervangt de AI-personalisatie uit PROJECT.md §3 laag 4 (geen
 * LLM-integratie in deze fase): een deterministische, uitlegbare top-N in
 * plaats van een gegenereerde tekst.
 */
function topReasons(
  profile: ProfileDimension[],
  dimensionNames: Map<string, string>,
  placeScores: PlaceScores,
  n = 4
): MatchReason[] {
  return profile
    .filter((p) => placeScores[p.dimensionKey] !== undefined)
    .map((p) => ({
      dimensionName: dimensionNames.get(p.dimensionKey) ?? p.dimensionKey,
      userScore: p.score,
      placeScore: placeScores[p.dimensionKey],
      fit: p.weight * (10 - Math.abs(p.score - placeScores[p.dimensionKey])),
    }))
    .sort((a, b) => b.fit - a.fit)
    .slice(0, n)
    .map(({ dimensionName, userScore, placeScore }) => ({ dimensionName, userScore, placeScore }));
}

export interface MatchOutcome {
  planA: MatchedPlace | null;
  planB: MatchedPlace | null;
  planC: MatchedPlace | null;
  top10: MatchedPlace[];
  excludedCount: number;
  consideredCount: number;
}

export async function computeMatches(
  testRunId: string,
  { persist = true }: { persist?: boolean } = {}
): Promise<MatchOutcome> {
  const [profileRows, dealBreakers, places] = await Promise.all([
    db.userProfileScore.findMany({
      where: { testRunId },
      include: { dimension: true },
    }),
    db.dealBreaker.findMany({ where: { testRunId } }),
    db.place.findMany({
      include: { scores: { include: { dimension: true } }, parent: true },
    }),
  ]);

  const profile: ProfileDimension[] = profileRows.map((r) => ({
    dimensionKey: r.dimension.key,
    score: r.score,
    weight: r.weight,
  }));
  const profileScores: PlaceScores = Object.fromEntries(
    profile.map((p) => [p.dimensionKey, p.score])
  );
  const dimensionNames = new Map(profileRows.map((r) => [r.dimension.key, r.dimension.name]));
  const scoresByPlace = new Map<string, PlaceScores>();

  let excludedCount = 0;
  const scored: MatchedPlace[] = [];

  for (const place of places) {
    const scores: PlaceScores = Object.fromEntries(
      place.scores.map((s) => [s.dimension.key, s.score])
    );
    scoresByPlace.set(place.id, scores);

    if (
      violatesDealBreakers(scores, place.countryCode, dealBreakers) ||
      violatesBudgetOrVisa(scores, profileScores)
    ) {
      excludedCount++;
      continue;
    }

    scored.push({
      placeId: place.id,
      name: place.name,
      level: place.level,
      countryCode: place.countryCode,
      parentName: place.parent?.name ?? null,
      matchPercent: matchPercent(profile, scores),
      reasons: [],
      scores,
    });
  }

  scored.sort((a, b) => b.matchPercent - a.matchPercent);

  const planA = scored[0] ?? null;
  const planAScores = planA ? scoresByPlace.get(planA.placeId) : undefined;

  // Plan B: beste match binnen de top 30 die aantoonbaar betaalbaarder en/of
  // makkelijker qua visum is dan Plan A (dat is wat "de haalbare optie"
  // belooft) — niet zomaar de eerstvolgende rij in de lijst.
  const planBCandidates = scored
    .slice(1, 30)
    .filter((p) => {
      if (!planAScores) return true;
      const s = scoresByPlace.get(p.placeId);
      if (!s) return false;
      return (
        (s.cost_of_living ?? 0) > (planAScores.cost_of_living ?? 0) ||
        (s.tax_visa ?? 0) > (planAScores.tax_visa ?? 0)
      );
    });
  const planB = planBCandidates[0] ?? scored.slice(1, 2)[0] ?? null;

  // Plan C: verrassende wildcard — beste match uit een ander land dan Plan A
  // en Plan B, buiten de voor de hand liggende top 3.
  const usedCountries = new Set([planA?.countryCode, planB?.countryCode].filter(Boolean));
  const planCCandidates = scored
    .slice(3)
    .filter((p) => !usedCountries.has(p.countryCode));
  const planC = planCCandidates[0] ?? scored.slice(5, 6)[0] ?? null;

  const top10 = scored.slice(0, 10);

  for (const p of [planA, planB, planC]) {
    if (!p) continue;
    const scores = scoresByPlace.get(p.placeId);
    if (scores) p.reasons = topReasons(profile, dimensionNames, scores);
  }

  if (persist && scored.length > 0) {
    await db.matchResult.deleteMany({ where: { testRunId } });
    const rows: {
      testRunId: string;
      placeId: string;
      matchPercent: number;
      planType: "PLAN_A" | "PLAN_B" | "PLAN_C" | "TOP_10";
      rank: number;
    }[] = [];
    if (planA) rows.push({ testRunId, placeId: planA.placeId, matchPercent: planA.matchPercent, planType: "PLAN_A", rank: 1 });
    if (planB) rows.push({ testRunId, placeId: planB.placeId, matchPercent: planB.matchPercent, planType: "PLAN_B", rank: 1 });
    if (planC) rows.push({ testRunId, placeId: planC.placeId, matchPercent: planC.matchPercent, planType: "PLAN_C", rank: 1 });
    top10.forEach((p, i) =>
      rows.push({ testRunId, placeId: p.placeId, matchPercent: p.matchPercent, planType: "TOP_10", rank: i + 1 })
    );
    await db.matchResult.createMany({ data: rows });
  }

  return { planA, planB, planC, top10, excludedCount, consideredCount: scored.length };
}
