import type {
  ExcludedWeekDay,
  ScoredWeekDay,
} from "../../domain/week/weekly-summary";

export function createScoredWeekDay(
  overrides: Partial<ScoredWeekDay> = {},
): ScoredWeekDay {
  return {
    date: "2026-06-29",
    state: "scored",
    finalScore: 80,
    ...overrides,
  };
}

export function createExcludedWeekDay(
  overrides: Partial<ExcludedWeekDay> = {},
): ExcludedWeekDay {
  return {
    date: "2026-06-30",
    state: "excluded",
    ...overrides,
  };
}
