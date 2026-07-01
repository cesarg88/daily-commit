import type { DayValidationIssue } from "@/domain/day/day-validation";

export const dayValidationMessageByCode: Record<
  DayValidationIssue["code"],
  string
> = {
  "base-weight-total-below-100": "Base objectives must add up to exactly 100%.",
  "base-weight-total-above-100": "Base objectives must add up to exactly 100%.",
  "insufficient-base-objectives": "Choose at least 3 base objectives.",
  "non-positive-weight": "Base objective weights must be greater than 0.",
  "missing-numeric-target": "Numeric base objectives need a target value.",
  "missing-numeric-unit": "Numeric base objectives need a unit.",
};

export function describeDayValidationIssues(
  issues: DayValidationIssue[],
): string[] {
  return Array.from(
    new Set(issues.map((issue) => dayValidationMessageByCode[issue.code])),
  );
}
