import type { Day } from "../../domain/day/day";

export function createDay(overrides: Partial<Day> = {}): Day {
  return {
    id: "day-1",
    date: "2026-06-30",
    state: "draft",
    ...overrides,
  };
}
