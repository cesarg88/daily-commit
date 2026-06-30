import { describe, expect, it } from "vitest";
import {
  buildWeeklySummary,
  calculateWeeklyConsistency,
  calculateWeeklyPerformance,
  getWeekRange,
} from "./weekly-summary";
import {
  createExcludedWeekDay,
  createScoredWeekDay,
} from "../../test/builders/weekly-day-builder";

describe("getWeekRange", () => {
  it("uses Monday as the first day of the week", () => {
    expect(getWeekRange("2026-07-01")).toEqual({
      startDate: "2026-06-29",
      endDate: "2026-07-05",
      dates: [
        "2026-06-29",
        "2026-06-30",
        "2026-07-01",
        "2026-07-02",
        "2026-07-03",
        "2026-07-04",
        "2026-07-05",
      ],
    });
  });
});

describe("calculateWeeklyPerformance", () => {
  it("averages scored days only", () => {
    const summary = buildWeeklySummary("2026-07-01", [
      createScoredWeekDay({ date: "2026-06-29", finalScore: 80 }),
      createScoredWeekDay({ date: "2026-06-30", finalScore: 100 }),
      createExcludedWeekDay({ date: "2026-07-02" }),
      createScoredWeekDay({ date: "2026-07-03", finalScore: 60 }),
      createScoredWeekDay({ date: "2026-07-04", finalScore: 90 }),
    ]);

    expect(summary.performance).toEqual({
      averageScore: 82.5,
      scoredDayCount: 4,
    });
  });

  it("returns no weekly performance when the week has no scored days", () => {
    expect(
      calculateWeeklyPerformance([
        { date: "2026-06-29", state: "excluded" },
        { date: "2026-06-30", state: "unconfigured" },
      ]),
    ).toEqual({
      averageScore: null,
      scoredDayCount: 0,
    });
  });
});

describe("calculateWeeklyConsistency", () => {
  it("reports scored, excluded, and unconfigured days separately", () => {
    expect(
      calculateWeeklyConsistency([
        { date: "2026-06-29", state: "scored", finalScore: 80 },
        { date: "2026-06-30", state: "scored", finalScore: 100 },
        { date: "2026-07-01", state: "unconfigured" },
        { date: "2026-07-02", state: "excluded" },
        { date: "2026-07-03", state: "scored", finalScore: 60 },
        { date: "2026-07-04", state: "scored", finalScore: 90 },
        { date: "2026-07-05", state: "unconfigured" },
      ]),
    ).toEqual({
      scoredDayCount: 4,
      excludedDayCount: 1,
      unconfiguredDayCount: 2,
      totalDayCount: 7,
    });
  });
});

describe("buildWeeklySummary", () => {
  it("fills missing week dates as unconfigured while keeping excluded and scored days distinct", () => {
    const summary = buildWeeklySummary("2026-07-01", [
      createScoredWeekDay({ date: "2026-06-29", finalScore: 80 }),
      createExcludedWeekDay({ date: "2026-07-02" }),
      createScoredWeekDay({ date: "2026-07-04", finalScore: 90 }),
    ]);

    expect(summary.days).toEqual([
      { date: "2026-06-29", state: "scored", finalScore: 80 },
      { date: "2026-06-30", state: "unconfigured" },
      { date: "2026-07-01", state: "unconfigured" },
      { date: "2026-07-02", state: "excluded" },
      { date: "2026-07-03", state: "unconfigured" },
      { date: "2026-07-04", state: "scored", finalScore: 90 },
      { date: "2026-07-05", state: "unconfigured" },
    ]);
    expect(summary.performance).toEqual({
      averageScore: 85,
      scoredDayCount: 2,
    });
    expect(summary.consistency).toEqual({
      scoredDayCount: 2,
      excludedDayCount: 1,
      unconfiguredDayCount: 4,
      totalDayCount: 7,
    });
  });
});
