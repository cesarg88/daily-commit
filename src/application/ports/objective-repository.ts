import type { Objective } from "../../domain/objective/objective";

export interface CreateObjectiveInput {
  name: string;
  type: Objective["type"];
  isActive: boolean;
  defaultTargetValue?: number;
  defaultUnit?: string;
  defaultWeight?: number;
}

export interface ObjectiveRepository {
  create(userId: string, objective: CreateObjectiveInput): Promise<Objective>;
  getById(userId: string, objectiveId: string): Promise<Objective | null>;
  listByUser(userId: string): Promise<Objective[]>;
  update(userId: string, objective: Objective): Promise<Objective>;
}
