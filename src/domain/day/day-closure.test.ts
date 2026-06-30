import { describe, expect, it } from "vitest";
import { createDay } from "../../test/builders/day-builder";
import {
  createBinaryDailyObjective,
  createNumericDailyObjective,
} from "../../test/builders/daily-objective-builder";
import {
  applyDayClosurePolicy,
  areBaseObjectivesComplete,
  determineDayClosureReason,
  isMidnightClosureEligible,
  MVP_TIMEZONE,
} from "./day-closure";
import { calculateScoreBreakdown } from "../scoring/score-calculator";

describe("areBaseObjectivesComplete", () => {
  it("returns true when all base objectives are fully complete", () => {
    const objectives = [
      createBinaryDailyObjective({ id: "base-1", isCompleted: true }),
      createNumericDailyObjective({
        id: "base-2",
        targetValue: 10,
        currentValue: 10,
      }),
      createBinaryDailyObjective({
        id: "bonus-1",
        kind: "bonus",
        isCompleted: false,
      }),
    ];

    expect(areBaseObjectivesComplete(objectives)).toBe(true);
  });

  it("returns false when a base numeric objective has not yet reached its target", () => {
    const objectives = [
      createBinaryDailyObjective({ id: "base-1", isCompleted: true }),
      createNumericDailyObjective({
        id: "base-2",
        targetValue: 10,
        currentValue: 9,
        isCompleted: true,
      }),
    ];

    expect(areBaseObjectivesComplete(objectives)).toBe(false);
  });
});

describe("isMidnightClosureEligible", () => {
  it("returns true when the active day date is earlier than the current local date in Europe/Madrid", () => {
    const day = createDay({
      date: "2026-06-30",
      state: "active",
    });

    expect(
      isMidnightClosureEligible(
        day,
        new Date("2026-06-30T22:30:00.000Z"),
        MVP_TIMEZONE,
      ),
    ).toBe(true);
  });

  it("returns false when the local date in Europe/Madrid has not changed yet", () => {
    const day = createDay({
      date: "2026-06-30",
      state: "active",
    });

    expect(
      isMidnightClosureEligible(
        day,
        new Date("2026-06-30T21:30:00.000Z"),
        MVP_TIMEZONE,
      ),
    ).toBe(false);
  });
});

describe("determineDayClosureReason", () => {
  it("returns base-objectives-complete when the base commitment is fulfilled", () => {
    const day = createDay({ state: "active" });
    const objectives = [
      createBinaryDailyObjective({ id: "base-1", isCompleted: true }),
      createNumericDailyObjective({
        id: "base-2",
        targetValue: 10,
        currentValue: 10,
      }),
      createBinaryDailyObjective({ id: "base-3", isCompleted: true }),
    ];

    expect(
      determineDayClosureReason(
        day,
        objectives,
        new Date("2026-06-30T10:00:00.000Z"),
      ),
    ).toBe("base-objectives-complete");
  });

  it("returns midnight when the day is still active after the local date changes", () => {
    const day = createDay({
      date: "2026-06-30",
      state: "active",
    });
    const objectives = [
      createBinaryDailyObjective({ id: "base-1", isCompleted: true }),
      createNumericDailyObjective({
        id: "base-2",
        targetValue: 10,
        currentValue: 5,
      }),
      createBinaryDailyObjective({ id: "base-3", isCompleted: false }),
    ];

    expect(
      determineDayClosureReason(
        day,
        objectives,
        new Date("2026-06-30T22:30:00.000Z"),
      ),
    ).toBe("midnight");
  });

  it("does not close only because bonus compensation raises the final score to 100", () => {
    const day = createDay({ state: "active" });
    const objectives = [
      createBinaryDailyObjective({
        id: "base-1",
        weight: 40,
        isCompleted: true,
      }),
      createNumericDailyObjective({
        id: "base-2",
        weight: 40,
        targetValue: 10,
        currentValue: 5,
      }),
      createBinaryDailyObjective({
        id: "base-3",
        weight: 20,
        isCompleted: false,
      }),
      createBinaryDailyObjective({
        id: "bonus-1",
        kind: "bonus",
        weight: 25,
        isCompleted: true,
      }),
      createNumericDailyObjective({
        id: "bonus-2",
        kind: "bonus",
        weight: 20,
        targetValue: 10,
        currentValue: 10,
      }),
    ];

    expect(calculateScoreBreakdown(objectives)).toEqual({
      baseScore: 60,
      bonusScore: 45,
      finalScore: 100,
    });
    expect(
      determineDayClosureReason(
        day,
        objectives,
        new Date("2026-06-30T10:00:00.000Z"),
      ),
    ).toBeUndefined();
  });
});

describe("applyDayClosurePolicy", () => {
  it("closes the day and records closedAt when the base commitment is complete", () => {
    const day = createDay({ state: "active" });
    const currentDateTime = new Date("2026-06-30T10:00:00.000Z");
    const objectives = [
      createBinaryDailyObjective({ id: "base-1", isCompleted: true }),
      createNumericDailyObjective({
        id: "base-2",
        targetValue: 10,
        currentValue: 10,
      }),
      createBinaryDailyObjective({ id: "base-3", isCompleted: true }),
    ];

    expect(applyDayClosurePolicy(day, objectives, currentDateTime)).toEqual({
      day: {
        ...day,
        state: "closed",
        closedAt: currentDateTime.toISOString(),
      },
      didClose: true,
      reason: "base-objectives-complete",
    });
  });

  it("is idempotent for a day that is already closed", () => {
    const day = createDay({
      state: "closed",
      closedAt: "2026-06-30T10:00:00.000Z",
    });
    const currentDateTime = new Date("2026-06-30T12:00:00.000Z");
    const objectives = [
      createBinaryDailyObjective({ id: "base-1", isCompleted: true }),
      createNumericDailyObjective({
        id: "base-2",
        targetValue: 10,
        currentValue: 10,
      }),
      createBinaryDailyObjective({ id: "base-3", isCompleted: true }),
    ];

    expect(applyDayClosurePolicy(day, objectives, currentDateTime)).toEqual({
      day,
      didClose: false,
    });
  });
});
