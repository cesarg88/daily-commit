import type { ObjectiveType } from "../objective/objective";

export type DailyObjectiveKind = "base" | "bonus";

interface DailyObjectiveBase {
  id: string;
  objectiveId: string;
  nameSnapshot: string;
  type: ObjectiveType;
  kind: DailyObjectiveKind;
  weight: number;
}

export interface BinaryDailyObjective extends DailyObjectiveBase {
  type: "binary";
  isCompleted: boolean;
}

export interface NumericDailyObjective extends DailyObjectiveBase {
  type: "numeric";
  targetValue: number;
  currentValue: number;
  unit: string;
  isCompleted: boolean;
}

export type DailyObjective = BinaryDailyObjective | NumericDailyObjective;
