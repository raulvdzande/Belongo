// Deel 3 — budget-verdeelspel: een fictief maandbudget verdelen over
// categorieën onthult echte prioriteiten (wat je zegt vs. wat je doet).

export interface BudgetCategory {
  key: string;
  label: string;
  emoji: string;
}

export const budgetCategories: BudgetCategory[] = [
  { key: "huur", label: "Huur/wonen", emoji: "🏠" },
  { key: "eten", label: "Eten & boodschappen", emoji: "🛒" },
  { key: "uitgaan", label: "Uitgaan & entertainment", emoji: "🎉" },
  { key: "sparen", label: "Sparen", emoji: "💰" },
  { key: "reizen", label: "Reizen", emoji: "✈️" },
  { key: "hobbies", label: "Hobby's & sport", emoji: "🎨" },
];

export const BUDGET_TOTAL = 100;

/**
 * Vertaalt de budgetverdeling naar extra gewicht op de bijbehorende
 * dimensies (PROJECT.md §3 laag 1: gewicht komt o.a. uit het budgetspel).
 * Een bovengemiddelde toewijzing (>100/6 ≈ 16.7) verhoogt het gewicht van
 * die dimensie in de matchberekening.
 */
export const BUDGET_CATEGORY_DIMENSIONS: Record<string, string[]> = {
  huur: ["housing", "cost_of_living"],
  eten: ["food_cuisine"],
  uitgaan: ["nightlife_entertainment", "social_community"],
  sparen: ["cost_of_living"],
  reizen: ["mobility_transport", "nature_landscape"],
  hobbies: ["hobbies_freetime", "sports_activities"],
};

export function weightBoostFromBudget(allocation: Record<string, number>): Record<string, number> {
  const fairShare = BUDGET_TOTAL / budgetCategories.length;
  const boosts: Record<string, number> = {};
  for (const cat of budgetCategories) {
    const allocated = allocation[cat.key] ?? fairShare;
    const relativeOveralloc = Math.max(0, (allocated - fairShare) / fairShare); // 0+
    const boost = Math.min(0.5, relativeOveralloc * 0.5); // cap +0.5 gewicht
    for (const dim of BUDGET_CATEGORY_DIMENSIONS[cat.key] ?? []) {
      boosts[dim] = (boosts[dim] ?? 0) + boost;
    }
  }
  return boosts;
}
