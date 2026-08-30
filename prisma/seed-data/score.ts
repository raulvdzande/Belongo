import type { CountryFact } from "./countries";

const clamp = (n: number) => Math.max(0, Math.min(10, Math.round(n * 10) / 10));

export interface CityBoost {
  urban: number;
  nightlife: number;
  costPenalty: number;
  diversity: number;
}

/** Bigger boost for the country's 1-2 largest ("major") cities than for smaller ones. */
export function cityBoostFor(major: boolean | undefined): CityBoost {
  return major
    ? { urban: 3, nightlife: 3, costPenalty: 1.5, diversity: 1 }
    : { urban: 1.5, nightlife: 1.5, costPenalty: 0.5, diversity: 0.5 };
}

/**
 * Derives the 24 place-scorable dimension scores (0-10) from a country's
 * factual axes. See docs/dimensions.md for the caveats on this first pass.
 */
export function deriveScores(f: CountryFact, boost?: CityBoost): Record<string, number> {
  const b = boost ?? { urban: 0, nightlife: 0, costPenalty: 0, diversity: 0 };

  const costOfLiving = clamp((6 - f.costTier) * 2 - b.costPenalty);
  const microstatePenalty = f.microstate ? 4 : 0;

  return {
    climate: clamp(f.climate),
    cost_of_living: costOfLiving,
    housing: clamp(costOfLiving - b.costPenalty * 0.5),
    work_career: clamp(((f.freedomTier + f.internetTier) / 2) * 2 - microstatePenalty),
    language: clamp(f.englishTier * 2),
    culture_mentality: clamp(5 + (f.secularTier - 3) * 0.5),
    nature_landscape: clamp(f.natureTier * 2),
    urbanicity: clamp(f.urbanTier * 2 + b.urban),
    social_community: clamp(f.diversityTier * 2 + b.diversity),
    safety: clamp(f.safetyTier * 2),
    healthcare: clamp(f.healthTier * 2),
    education: clamp(((f.healthTier + f.freedomTier) / 2) * 2),
    family_relation: clamp(5 + (5 - f.secularTier) * 0.3),
    mobility_transport: clamp(((f.internetTier + f.urbanTier) / 2) * 2),
    politics_freedom: clamp(f.freedomTier * 2),
    religion_worldview: clamp(f.secularTier * 2),
    food_cuisine: clamp(f.foodTier * 2),
    hobbies_freetime: clamp(((f.urbanTier + f.natureTier) / 2) * 2),
    sports_activities: clamp(f.natureTier * 2),
    nightlife_entertainment: clamp(f.urbanTier * 2 + b.nightlife),
    diversity_expat: clamp(f.diversityTier * 2 + b.diversity),
    tax_visa: clamp(f.freedomTier * 1.5 + (f.euMember ? 2 : 0) - microstatePenalty),
    internet_infra: clamp(f.internetTier * 2),
    sustainability_environment: clamp(f.sustainTier * 2),
  };
}
