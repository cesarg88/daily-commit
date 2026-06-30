import type { DailyObjective } from "../day/daily-objective";

export interface ScoreBreakdown {
  baseScore: number;
  bonusScore: number;
  finalScore: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateObjectiveContribution(
  objective: DailyObjective,
): number {
  if (objective.type === "binary") {
    return objective.isCompleted ? objective.weight : 0;
  }

  if (objective.targetValue <= 0) {
    return 0;
  }

  const progress = clamp(objective.currentValue / objective.targetValue, 0, 1);
  return progress * objective.weight;
}

export function calculateBaseScore(objectives: DailyObjective[]): number {
  return objectives
    .filter((objective) => objective.kind === "base")
    .reduce(
      (total, objective) => total + calculateObjectiveContribution(objective),
      0,
    );
}

export function calculateBonusScore(objectives: DailyObjective[]): number {
  return objectives
    .filter((objective) => objective.kind === "bonus")
    .reduce(
      (total, objective) => total + calculateObjectiveContribution(objective),
      0,
    );
}

export function calculateFinalScore(
  baseScore: number,
  bonusScore: number,
): number {
  return Math.min(baseScore + bonusScore, 100);
}

export function calculateScoreBreakdown(
  objectives: DailyObjective[],
): ScoreBreakdown {
  const baseScore = calculateBaseScore(objectives);
  const bonusScore = calculateBonusScore(objectives);

  return {
    baseScore,
    bonusScore,
    finalScore: calculateFinalScore(baseScore, bonusScore),
  };
}
