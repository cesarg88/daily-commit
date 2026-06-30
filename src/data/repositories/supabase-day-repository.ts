import type {
  DayRepository,
  PersistedDayRecord,
  PersistedUserDayRecord,
} from "../../application/ports/day-repository";
import type {
  DailyObjective,
  NumericDailyObjective,
} from "../../domain/day/daily-objective";
import type { Day } from "../../domain/day/day";
import type { DatabaseClient } from "../supabase/client.types";
import { requireData, requireNoError } from "./supabase-repository-utils";

const DAY_COLUMNS = "id, date, state, closed_at";
const USER_DAY_COLUMNS = "id, user_id, date, state, closed_at";

const DAILY_OBJECTIVE_COLUMNS =
  "id, objective_id, name_snapshot, type, kind, weight, target_value, current_value, unit, is_completed";

interface DayRowProjection {
  id: string;
  date: string;
  state: Day["state"];
  closed_at: string | null;
}

interface UserDayRowProjection extends DayRowProjection {
  user_id: string;
}

function mapDayRowToDomain(row: DayRowProjection): Day {
  return {
    id: row.id,
    date: row.date,
    state: row.state,
    closedAt: row.closed_at ?? undefined,
  };
}

function mapDailyObjectiveRowToDomain(row: {
  id: string;
  objective_id: string;
  name_snapshot: string;
  type: DailyObjective["type"];
  kind: DailyObjective["kind"];
  weight: number;
  target_value: number | null;
  current_value: number | null;
  unit: string | null;
  is_completed: boolean;
}): DailyObjective {
  if (row.type === "binary") {
    return {
      id: row.id,
      objectiveId: row.objective_id,
      nameSnapshot: row.name_snapshot,
      type: "binary",
      kind: row.kind,
      weight: row.weight,
      isCompleted: row.is_completed,
    };
  }

  return {
    id: row.id,
    objectiveId: row.objective_id,
    nameSnapshot: row.name_snapshot,
    type: "numeric",
    kind: row.kind,
    weight: row.weight,
    targetValue: row.target_value ?? 0,
    currentValue: row.current_value ?? 0,
    unit: row.unit ?? "",
    isCompleted: row.is_completed,
  } satisfies NumericDailyObjective;
}

function mapDailyObjectiveToInsertRow(
  userId: string,
  dayId: string,
  objective: DailyObjective,
) {
  return {
    id: objective.id,
    user_id: userId,
    day_id: dayId,
    objective_id: objective.objectiveId,
    name_snapshot: objective.nameSnapshot,
    type: objective.type,
    kind: objective.kind,
    weight: objective.weight,
    target_value: objective.type === "numeric" ? objective.targetValue : null,
    current_value: objective.type === "numeric" ? objective.currentValue : null,
    unit: objective.type === "numeric" ? objective.unit : null,
    is_completed: objective.isCompleted,
  };
}

export class SupabaseDayRepository implements DayRepository {
  constructor(private readonly client: DatabaseClient) {}

  private async getObjectivesForDay(
    userId: string,
    dayId: string,
  ): Promise<DailyObjective[]> {
    const objectiveRows = await requireData(
      this.client
        .from("daily_objectives")
        .select(DAILY_OBJECTIVE_COLUMNS)
        .eq("user_id", userId)
        .eq("day_id", dayId)
        .order("created_at", { ascending: true }),
      "Failed to fetch daily objectives",
    );

    return objectiveRows.map(mapDailyObjectiveRowToDomain);
  }

  async getByDate(
    userId: string,
    date: string,
  ): Promise<PersistedDayRecord | null> {
    const { data, error } = await this.client
      .from("days")
      .select(DAY_COLUMNS)
      .eq("user_id", userId)
      .eq("date", date)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch day by date: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return {
      day: mapDayRowToDomain(data),
      objectives: await this.getObjectivesForDay(userId, data.id),
    };
  }

  async listActiveBeforeDate(
    beforeDate: string,
    userId?: string,
  ): Promise<PersistedUserDayRecord[]> {
    let query = this.client
      .from("days")
      .select(USER_DAY_COLUMNS)
      .eq("state", "active")
      .lt("date", beforeDate)
      .order("date", { ascending: true });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const rows: UserDayRowProjection[] = await requireData(
      query,
      "Failed to list active days before date",
    );

    return Promise.all(
      rows.map(async (row) => ({
        userId: row.user_id,
        day: mapDayRowToDomain(row),
        objectives: await this.getObjectivesForDay(row.user_id, row.id),
      })),
    );
  }

  async listByDateRange(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<Day[]> {
    const rows = await requireData(
      this.client
        .from("days")
        .select(DAY_COLUMNS)
        .eq("user_id", userId)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: true }),
      "Failed to list days in range",
    );

    return rows.map(mapDayRowToDomain);
  }

  async saveDay(
    userId: string,
    record: PersistedDayRecord,
  ): Promise<PersistedDayRecord> {
    const savedDayRow: DayRowProjection = await requireData(
      this.client
        .from("days")
        .upsert(
          {
            id: record.day.id,
            user_id: userId,
            date: record.day.date,
            state: record.day.state,
            closed_at: record.day.closedAt ?? null,
          },
          {
            onConflict: "id",
          },
        )
        .select(DAY_COLUMNS)
        .single(),
      "Failed to save day",
    );

    await requireNoError(
      this.client
        .from("daily_objectives")
        .delete()
        .eq("user_id", userId)
        .eq("day_id", savedDayRow.id),
      "Failed to clear daily objectives before save",
    );

    let savedObjectiveRows: Array<{
      id: string;
      objective_id: string;
      name_snapshot: string;
      type: DailyObjective["type"];
      kind: DailyObjective["kind"];
      weight: number;
      target_value: number | null;
      current_value: number | null;
      unit: string | null;
      is_completed: boolean;
    }> = [];

    if (record.objectives.length > 0) {
      savedObjectiveRows = await requireData(
        this.client
          .from("daily_objectives")
          .insert(
            record.objectives.map((objective) =>
              mapDailyObjectiveToInsertRow(userId, savedDayRow.id, objective),
            ),
          )
          .select(DAILY_OBJECTIVE_COLUMNS),
        "Failed to save daily objectives",
      );
    }

    return {
      day: mapDayRowToDomain(savedDayRow),
      objectives: savedObjectiveRows.map(mapDailyObjectiveRowToDomain),
    };
  }

  async updateDay(userId: string, day: Day): Promise<Day> {
    const row = await requireData(
      this.client
        .from("days")
        .update({
          date: day.date,
          state: day.state,
          closed_at: day.closedAt ?? null,
        })
        .eq("user_id", userId)
        .eq("id", day.id)
        .select(DAY_COLUMNS)
        .single(),
      "Failed to update day",
    );

    return mapDayRowToDomain(row);
  }
}
