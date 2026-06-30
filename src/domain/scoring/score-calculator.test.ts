import { describe, expect, it } from "vitest";
import {
  createBinaryDailyObjective,
  createNumericDailyObjective,
  createObjectiveSet,
} from "../../test/builders/daily-objective-builder";
import {
  calculateBaseScore,
  calculateBonusScore,
  calculateFinalScore,
  calculateObjectiveContribution,
  calculateScoreBreakdown,
} from "./score-calculator";

describe("calculateObjectiveContribution", () => {
  it("returns 0 for an incomplete binary objective", () => {
    const objective = createBinaryDailyObjective({
      weight: 25,
      isCompleted: false,
    });

    expect(calculateObjectiveContribution(objective)).toBe(0);
  });

  it("returns full weight for a completed binary objective", () => {
    const objective = createBinaryDailyObjective({
      weight: 25,
      isCompleted: true,
    });

    expect(calculateObjectiveContribution(objective)).toBe(25);
  });

  it("calculates proportional contribution for a numeric objective", () => {
    const objective = createNumericDailyObjective({
      weight: 40,
      currentValue: 25,
      targetValue: 100,
    });

    expect(calculateObjectiveContribution(objective)).toBe(10);
  });

  it("caps numeric contribution at the configured weight", () => {
    const objective = createNumericDailyObjective({
      weight: 40,
      currentValue: 120,
      targetValue: 100,
    });

    expect(calculateObjectiveContribution(objective)).toBe(40);
  });

  it("clamps negative numeric progress to zero contribution", () => {
    const objective = createNumericDailyObjective({
      weight: 40,
      currentValue: -5,
      targetValue: 100,
    });

    expect(calculateObjectiveContribution(objective)).toBe(0);
  });

  it("returns zero when target value is not positive", () => {
    const objective = createNumericDailyObjective({
      weight: 40,
      currentValue: 50,
      targetValue: 0,
    });

    expect(calculateObjectiveContribution(objective)).toBe(0);
  });
});

describe("score aggregation", () => {
  it("sums contributions from base objectives only for the base score", () => {
    const [baseBinary, baseNumeric] = createObjectiveSet("base");
    const [bonusBinary, bonusNumeric] = createObjectiveSet("bonus");

    const objectives = [
      { ...baseBinary, weight: 25, isCompleted: true },
      { ...baseNumeric, weight: 40, currentValue: 50, targetValue: 100 },
      { ...bonusBinary, weight: 10, isCompleted: true },
      { ...bonusNumeric, weight: 15, currentValue: 100, targetValue: 100 },
    ];

    expect(calculateBaseScore(objectives)).toBe(45);
  });

  it("sums contributions from bonus objectives only for the bonus score", () => {
    const [baseBinary, baseNumeric] = createObjectiveSet("base");
    const [bonusBinary, bonusNumeric] = createObjectiveSet("bonus");

    const objectives = [
      { ...baseBinary, weight: 25, isCompleted: true },
      { ...baseNumeric, weight: 40, currentValue: 50, targetValue: 100 },
      { ...bonusBinary, weight: 10, isCompleted: true },
      { ...bonusNumeric, weight: 15, currentValue: 100, targetValue: 100 },
    ];

    expect(calculateBonusScore(objectives)).toBe(25);
  });

  it("caps the final score at 100", () => {
    expect(calculateFinalScore(85, 25)).toBe(100);
  });

  it("returns a score breakdown with uncapped base and bonus plus capped final score", () => {
    const [baseBinary, baseNumeric] = createObjectiveSet("base");
    const [bonusBinary, bonusNumeric] = createObjectiveSet("bonus");

    const objectives = [
      { ...baseBinary, weight: 50, isCompleted: true },
      { ...baseNumeric, weight: 40, currentValue: 50, targetValue: 100 },
      { ...bonusBinary, weight: 15, isCompleted: true },
      { ...bonusNumeric, weight: 10, currentValue: 100, targetValue: 100 },
    ];

    expect(calculateScoreBreakdown(objectives)).toEqual({
      baseScore: 70,
      bonusScore: 25,
      finalScore: 95,
    });
  });

  it("keeps base and bonus scores separate when bonus compensation caps final score at 100", () => {
    const [baseBinary, baseNumeric] = createObjectiveSet("base");
    const [bonusBinary, bonusNumeric] = createObjectiveSet("bonus");

    const objectives = [
      { ...baseBinary, weight: 40, isCompleted: true },
      { ...baseNumeric, weight: 40, currentValue: 50, targetValue: 100 },
      { ...bonusBinary, weight: 25, isCompleted: true },
      { ...bonusNumeric, weight: 20, currentValue: 100, targetValue: 100 },
    ];

    expect(calculateScoreBreakdown(objectives)).toEqual({
      baseScore: 60,
      bonusScore: 45,
      finalScore: 100,
    });
  });

  it("preserves floating-point precision without display rounding inside the domain", () => {
    const objective = createNumericDailyObjective({
      weight: 30,
      currentValue: 1,
      targetValue: 3,
    });

    expect(calculateObjectiveContribution(objective)).toBeCloseTo(10, 10);
  });
});
