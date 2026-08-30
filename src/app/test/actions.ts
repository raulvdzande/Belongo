"use server";

import { db } from "@/lib/db";
import { allQuestions, scoreForAnswer } from "@/lib/questions";
import type { SelectedDealBreaker } from "@/lib/dealBreakers";
import type { PracticalInput } from "@/lib/practical";
import { weightBoostFromBudget } from "@/lib/budgetGame";

export interface SubmitTestRunInput {
  answers: Record<string, number>;
  dealBreakers: SelectedDealBreaker[];
  budgetAllocation: Record<string, number>;
  practical: PracticalInput;
}

export interface SubmitTestRunResult {
  testRunId: string;
  matchPrecision: number;
  dimensionCount: number;
}

/**
 * Aggregeert alle antwoorden (deel 1, 2, 5, 6) per dimensie tot één score
 * (0-10) en een gewicht: hoe extremer (verder van neutraal) iemand
 * antwoordt, hoe belangrijker die dimensie kennelijk is. Het
 * budget-verdeelspel (deel 3) legt daar nog een extra gewicht bovenop —
 * samen dekt dit PROJECT.md §3 laag 1 ("gewicht komt uit deel 1 + het
 * budgetspel + de dilemma's").
 */
export async function submitTestRun(
  input: SubmitTestRunInput
): Promise<SubmitTestRunResult> {
  const byDimension = new Map<string, number[]>();

  for (const q of allQuestions) {
    const raw = input.answers[q.id];
    if (raw === undefined) continue;
    const score = scoreForAnswer(q, raw);
    const list = byDimension.get(q.dimensionKey) ?? [];
    list.push(score);
    byDimension.set(q.dimensionKey, list);
  }

  const dimensionRows = await db.dimension.findMany({
    where: { key: { in: Array.from(byDimension.keys()) } },
  });
  const dimensionIdByKey = new Map(dimensionRows.map((d) => [d.key, d.id]));

  const matchPrecision = Object.keys(input.answers).length / allQuestions.length;
  const budgetWeightBoost = weightBoostFromBudget(input.budgetAllocation);

  const testRun = await db.testRun.create({
    data: {
      matchPrecision,
      completedAt: matchPrecision >= 1 ? new Date() : null,
      budgetAllocation: input.budgetAllocation,
      nationality: input.practical.nationality || null,
      remoteWork: input.practical.remoteWork ?? null,
      hasKids: input.practical.hasKids ?? null,
      movingBudget: input.practical.movingBudget || null,
      languageLevel: input.practical.languageLevel || null,
    },
  });

  const profileScores = Array.from(byDimension.entries())
    .map(([key, scores]) => {
      const dimensionId = dimensionIdByKey.get(key);
      if (!dimensionId) return null;
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      const weight = 1 + Math.abs(avg - 5) / 5 + (budgetWeightBoost[key] ?? 0); // ~1.0 - 2.5
      return { testRunId: testRun.id, dimensionId, score: avg, weight };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (profileScores.length > 0) {
    await db.userProfileScore.createMany({ data: profileScores });
  }

  if (input.dealBreakers.length > 0) {
    await db.dealBreaker.createMany({
      data: input.dealBreakers.map((db_) => ({
        testRunId: testRun.id,
        label: db_.label,
        type: db_.type,
      })),
    });
  }

  return {
    testRunId: testRun.id,
    matchPrecision,
    dimensionCount: profileScores.length,
  };
}
