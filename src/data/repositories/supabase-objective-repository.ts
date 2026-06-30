import type {
  CreateObjectiveInput,
  ObjectiveRepository,
} from "../../application/ports/objective-repository";
import type { Objective } from "../../domain/objective/objective";
import type { DatabaseClient } from "../supabase/client.types";
import { requireData } from "./supabase-repository-utils";

const OBJECTIVE_COLUMNS =
  "id, name, type, is_active, default_target_value, default_unit, default_weight";

function mapObjectiveRowToDomain(row: {
  id: string;
  name: string;
  type: "binary" | "numeric";
  is_active: boolean;
  default_target_value: number | null;
  default_unit: string | null;
  default_weight: number | null;
}): Objective {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    isActive: row.is_active,
    defaultTargetValue: row.default_target_value ?? undefined,
    defaultUnit: row.default_unit ?? undefined,
    defaultWeight: row.default_weight ?? undefined,
  };
}

export class SupabaseObjectiveRepository implements ObjectiveRepository {
  constructor(private readonly client: DatabaseClient) {}

  async create(
    userId: string,
    objective: CreateObjectiveInput,
  ): Promise<Objective> {
    const row = await requireData(
      this.client
        .from("objectives")
        .insert({
          user_id: userId,
          name: objective.name,
          type: objective.type,
          is_active: objective.isActive,
          default_target_value: objective.defaultTargetValue ?? null,
          default_unit: objective.defaultUnit ?? null,
          default_weight: objective.defaultWeight ?? null,
        })
        .select(OBJECTIVE_COLUMNS)
        .single(),
      "Failed to create objective",
    );

    return mapObjectiveRowToDomain(row);
  }

  async getById(
    userId: string,
    objectiveId: string,
  ): Promise<Objective | null> {
    const { data, error } = await this.client
      .from("objectives")
      .select(OBJECTIVE_COLUMNS)
      .eq("user_id", userId)
      .eq("id", objectiveId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch objective: ${error.message}`);
    }

    return data ? mapObjectiveRowToDomain(data) : null;
  }

  async listByUser(userId: string): Promise<Objective[]> {
    const rows = await requireData(
      this.client
        .from("objectives")
        .select(OBJECTIVE_COLUMNS)
        .eq("user_id", userId)
        .order("created_at", { ascending: true }),
      "Failed to list objectives",
    );

    return rows.map(mapObjectiveRowToDomain);
  }

  async update(userId: string, objective: Objective): Promise<Objective> {
    const row = await requireData(
      this.client
        .from("objectives")
        .update({
          name: objective.name,
          type: objective.type,
          is_active: objective.isActive,
          default_target_value: objective.defaultTargetValue ?? null,
          default_unit: objective.defaultUnit ?? null,
          default_weight: objective.defaultWeight ?? null,
        })
        .eq("user_id", userId)
        .eq("id", objective.id)
        .select(OBJECTIVE_COLUMNS)
        .single(),
      "Failed to update objective",
    );

    return mapObjectiveRowToDomain(row);
  }
}
