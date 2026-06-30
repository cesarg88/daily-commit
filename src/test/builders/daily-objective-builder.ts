import type {
  BinaryDailyObjective,
  DailyObjectiveKind,
  NumericDailyObjective,
} from "../../domain/day/daily-objective";

export function createBinaryDailyObjective(
  overrides: Partial<BinaryDailyObjective> = {},
): BinaryDailyObjective {
  return {
    id: "binary-objective",
    objectiveId: "objective-binary",
    nameSnapshot: "Binary objective",
    type: "binary",
    kind: "base",
    weight: 20,
    isCompleted: false,
    ...overrides,
  };
}

export function createNumericDailyObjective(
  overrides: Partial<NumericDailyObjective> = {},
): NumericDailyObjective {
  return {
    id: "numeric-objective",
    objectiveId: "objective-numeric",
    nameSnapshot: "Numeric objective",
    type: "numeric",
    kind: "base",
    weight: 40,
    targetValue: 100,
    currentValue: 0,
    unit: "points",
    isCompleted: false,
    ...overrides,
  };
}

export function createObjectiveSet(
  kind: DailyObjectiveKind,
): [BinaryDailyObjective, NumericDailyObjective] {
  return [
    createBinaryDailyObjective({
      id: `${kind}-binary`,
      objectiveId: `${kind}-objective-binary`,
      kind,
    }),
    createNumericDailyObjective({
      id: `${kind}-numeric`,
      objectiveId: `${kind}-objective-numeric`,
      kind,
    }),
  ];
}
