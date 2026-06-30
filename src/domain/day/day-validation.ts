import type { DailyObjective } from "./daily-objective";

export type DayValidationIssueCode =
  | "base-weight-total-below-100"
  | "base-weight-total-above-100"
  | "insufficient-base-objectives"
  | "non-positive-weight"
  | "missing-numeric-target"
  | "missing-numeric-unit";

export interface DayValidationIssue {
  code: DayValidationIssueCode;
  objectiveId?: string;
}

export interface DayActivationValidationResult {
  isValid: boolean;
  baseObjectiveCount: number;
  baseWeightTotal: number;
  issues: DayValidationIssue[];
}

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

export function calculateBaseObjectiveCount(
  objectives: DailyObjective[],
): number {
  return objectives.filter((objective) => objective.kind === "base").length;
}

export function calculateBaseWeightTotal(objectives: DailyObjective[]): number {
  return objectives
    .filter((objective) => objective.kind === "base")
    .reduce((total, objective) => total + objective.weight, 0);
}

export function validateDailyObjective(
  objective: DailyObjective,
): DayValidationIssue[] {
  const issues: DayValidationIssue[] = [];

  if (objective.weight <= 0) {
    issues.push({
      code: "non-positive-weight",
      objectiveId: objective.id,
    });
  }

  if (objective.type === "numeric") {
    if (objective.targetValue <= 0) {
      issues.push({
        code: "missing-numeric-target",
        objectiveId: objective.id,
      });
    }

    if (isBlank(objective.unit)) {
      issues.push({
        code: "missing-numeric-unit",
        objectiveId: objective.id,
      });
    }
  }

  return issues;
}

export function validateDayActivation(
  objectives: DailyObjective[],
): DayActivationValidationResult {
  const baseObjectiveCount = calculateBaseObjectiveCount(objectives);
  const baseWeightTotal = calculateBaseWeightTotal(objectives);
  const issues = objectives.flatMap(validateDailyObjective);

  if (baseObjectiveCount < 3) {
    issues.push({
      code: "insufficient-base-objectives",
    });
  }

  if (baseWeightTotal < 100) {
    issues.push({
      code: "base-weight-total-below-100",
    });
  }

  if (baseWeightTotal > 100) {
    issues.push({
      code: "base-weight-total-above-100",
    });
  }

  return {
    isValid: issues.length === 0,
    baseObjectiveCount,
    baseWeightTotal,
    issues,
  };
}
