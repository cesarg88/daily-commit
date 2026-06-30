export type ObjectiveType = "binary" | "numeric";

export interface Objective {
  id: string;
  name: string;
  type: ObjectiveType;
  isActive: boolean;
  defaultTargetValue?: number;
  defaultUnit?: string;
  defaultWeight?: number;
}
