import type {
  ClosedDayScoreSnapshot,
  ScoreSnapshotRepository,
} from "../../application/ports/score-snapshot-repository";
import type { DatabaseClient } from "../supabase/client.types";
import { requireData } from "./supabase-repository-utils";

const SCORE_SNAPSHOT_COLUMNS =
  "day_id, final_score, base_score, bonus_score, calculated_at";

function mapScoreSnapshotRowToDomain(row: {
  day_id: string;
  final_score: number;
  base_score: number;
  bonus_score: number;
  calculated_at: string;
}): ClosedDayScoreSnapshot {
  return {
    dayId: row.day_id,
    finalScore: row.final_score,
    baseScore: row.base_score,
    bonusScore: row.bonus_score,
    calculatedAt: row.calculated_at,
  };
}

export class SupabaseScoreSnapshotRepository implements ScoreSnapshotRepository {
  constructor(private readonly client: DatabaseClient) {}

  async getByDayId(
    userId: string,
    dayId: string,
  ): Promise<ClosedDayScoreSnapshot | null> {
    const { data, error } = await this.client
      .from("closed_day_score_snapshots")
      .select(SCORE_SNAPSHOT_COLUMNS)
      .eq("user_id", userId)
      .eq("day_id", dayId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch score snapshot: ${error.message}`);
    }

    return data ? mapScoreSnapshotRowToDomain(data) : null;
  }

  async listByDayIds(
    userId: string,
    dayIds: string[],
  ): Promise<ClosedDayScoreSnapshot[]> {
    if (dayIds.length === 0) {
      return [];
    }

    const rows = await requireData(
      this.client
        .from("closed_day_score_snapshots")
        .select(SCORE_SNAPSHOT_COLUMNS)
        .eq("user_id", userId)
        .in("day_id", dayIds),
      "Failed to list score snapshots",
    );

    return rows.map(mapScoreSnapshotRowToDomain);
  }

  async upsert(
    userId: string,
    snapshot: ClosedDayScoreSnapshot,
  ): Promise<ClosedDayScoreSnapshot> {
    const row = await requireData(
      this.client
        .from("closed_day_score_snapshots")
        .upsert(
          {
            user_id: userId,
            day_id: snapshot.dayId,
            final_score: snapshot.finalScore,
            base_score: snapshot.baseScore,
            bonus_score: snapshot.bonusScore,
            calculated_at: snapshot.calculatedAt,
          },
          {
            onConflict: "day_id",
          },
        )
        .select(SCORE_SNAPSHOT_COLUMNS)
        .single(),
      "Failed to upsert score snapshot",
    );

    return mapScoreSnapshotRowToDomain(row);
  }
}
