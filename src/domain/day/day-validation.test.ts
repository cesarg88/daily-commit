import { describe, expect, it } from "vitest";
import {
  createBinaryDailyObjective,
  createNumericDailyObjective,
} from "../../test/builders/daily-objective-builder";
import {
  calculateBaseObjectiveCount,
  calculateBaseWeightTotal,
  validateDailyObjective,
  validateDayActivation,
} from "./day-validation";

describe("validateDailyObjective", () => {
  it("returns a non-positive-weight issue when an objective weight is zero or negative", () => {
    const objective = createBinaryDailyObjective({
      id: "base-1",
      weight: 0,
    });

    expect(validateDailyObjective(objective)).toEqual([
      {
        code: "non-positive-weight",
        objectiveId: "base-1",
      },
    ]);
  });

  it("returns missing numeric target and unit issues for incomplete numeric configuration", () => {
    const objective = createNumericDailyObjective({
      id: "numeric-1",
      targetValue: 0,
      unit: "   ",
    });

    expect(validateDailyObjective(objective)).toEqual([
      {
        code: "missing-numeric-target",
        objectiveId: "numeric-1",
      },
      {
        code: "missing-numeric-unit",
        objectiveId: "numeric-1",
      },
    ]);
  });
});

describe("validateDayActivation", () => {
  it("is invalid when the base total is below 100", () => {
    const objectives = [
      createBinaryDailyObjective({ id: "base-1", weight: 30 }),
      createBinaryDailyObjective({ id: "base-2", weight: 30 }),
      createNumericDailyObjective({ id: "base-3", weight: 20, unit: "km" }),
    ];

    expect(validateDayActivation(objectives)).toEqual({
      isValid: false,
      baseObjectiveCount: 3,
      baseWeightTotal: 80,
      issues: [{ code: "base-weight-total-below-100" }],
    });
  });

  it("is invalid when the base total is above 100", () => {
    const objectives = [
      createBinaryDailyObjective({ id: "base-1", weight: 30 }),
      createBinaryDailyObjective({ id: "base-2", weight: 35 }),
      createNumericDailyObjective({ id: "base-3", weight: 40, unit: "km" }),
    ];

    expect(validateDayActivation(objectives)).toEqual({
      isValid: false,
      baseObjectiveCount: 3,
      baseWeightTotal: 105,
      issues: [{ code: "base-weight-total-above-100" }],
    });
  });

  it("is invalid when there are fewer than three base objectives", () => {
    const objectives = [
      createBinaryDailyObjective({ id: "base-1", weight: 50 }),
      createNumericDailyObjective({ id: "base-2", weight: 50, unit: "km" }),
      createBinaryDailyObjective({
        id: "bonus-1",
        kind: "bonus",
        weight: 20,
      }),
    ];

    expect(validateDayActivation(objectives)).toEqual({
      isValid: false,
      baseObjectiveCount: 2,
      baseWeightTotal: 100,
      issues: [{ code: "insufficient-base-objectives" }],
    });
  });

  it("is valid with at least three base objectives, a base total of 100, and complete numeric configuration", () => {
    const objectives = [
      createBinaryDailyObjective({ id: "base-1", weight: 30 }),
      createBinaryDailyObjective({ id: "base-2", weight: 30 }),
      createNumericDailyObjective({
        id: "base-3",
        weight: 40,
        targetValue: 5,
        unit: "km",
      }),
      createBinaryDailyObjective({
        id: "bonus-1",
        kind: "bonus",
        weight: 15,
      }),
    ];

    expect(validateDayActivation(objectives)).toEqual({
      isValid: true,
      baseObjectiveCount: 3,
      baseWeightTotal: 100,
      issues: [],
    });
  });

  it("returns objective-level issues alongside activation-level issues", () => {
    const objectives = [
      createBinaryDailyObjective({ id: "base-1", weight: 40 }),
      createBinaryDailyObjective({ id: "base-2", weight: -10 }),
      createNumericDailyObjective({
        id: "base-3",
        weight: 40,
        targetValue: 0,
        unit: "",
      }),
    ];

    expect(validateDayActivation(objectives)).toEqual({
      isValid: false,
      baseObjectiveCount: 3,
      baseWeightTotal: 70,
      issues: [
        {
          code: "non-positive-weight",
          objectiveId: "base-2",
        },
        {
          code: "missing-numeric-target",
          objectiveId: "base-3",
        },
        {
          code: "missing-numeric-unit",
          objectiveId: "base-3",
        },
        { code: "base-weight-total-below-100" },
      ],
    });
  });
});

describe("day validation aggregates", () => {
  it("counts only base objectives for activation eligibility", () => {
    const objectives = [
      createBinaryDailyObjective({ id: "base-1", weight: 40 }),
      createBinaryDailyObjective({ id: "base-2", weight: 35 }),
      createNumericDailyObjective({ id: "base-3", weight: 25, unit: "km" }),
      createBinaryDailyObjective({
        id: "bonus-1",
        kind: "bonus",
        weight: 10,
      }),
    ];

    expect(calculateBaseObjectiveCount(objectives)).toBe(3);
  });

  it("sums only base objective weights for the activation total", () => {
    const objectives = [
      createBinaryDailyObjective({ id: "base-1", weight: 40 }),
      createBinaryDailyObjective({ id: "base-2", weight: 35 }),
      createNumericDailyObjective({ id: "base-3", weight: 25, unit: "km" }),
      createBinaryDailyObjective({
        id: "bonus-1",
        kind: "bonus",
        weight: 10,
      }),
    ];

    expect(calculateBaseWeightTotal(objectives)).toBe(100);
  });
});
