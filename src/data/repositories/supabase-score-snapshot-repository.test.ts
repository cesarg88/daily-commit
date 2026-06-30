import { describe, expect, it } from "vitest";
import { SupabaseScoreSnapshotRepository } from "./supabase-score-snapshot-repository";
import {
  createMockSupabaseClient,
  createMockTable,
} from "../../test/builders/supabase-client-builder";

describe("SupabaseScoreSnapshotRepository", () => {
  it("upserts a closed-day score snapshot with separate final, base, and bonus scores", async () => {
    const snapshotsTable = createMockTable({
      singleResult: {
        data: {
          day_id: "day-1",
          final_score: 95,
          base_score: 70,
          bonus_score: 25,
          calculated_at: "2026-07-01T20:00:00.000Z",
        },
        error: null,
      },
    });
    const repository = new SupabaseScoreSnapshotRepository(
      createMockSupabaseClient({
        closed_day_score_snapshots: [snapshotsTable],
      }),
    );

    await expect(
      repository.upsert("user-1", {
        dayId: "day-1",
        finalScore: 95,
        baseScore: 70,
        bonusScore: 25,
        calculatedAt: "2026-07-01T20:00:00.000Z",
      }),
    ).resolves.toEqual({
      dayId: "day-1",
      finalScore: 95,
      baseScore: 70,
      bonusScore: 25,
      calculatedAt: "2026-07-01T20:00:00.000Z",
    });

    expect(snapshotsTable.calls.upsert).toEqual([
      [
        {
          user_id: "user-1",
          day_id: "day-1",
          final_score: 95,
          base_score: 70,
          bonus_score: 25,
          calculated_at: "2026-07-01T20:00:00.000Z",
        },
        {
          onConflict: "day_id",
        },
      ],
    ]);
  });

  it("gets a score snapshot by owned day id", async () => {
    const snapshotsTable = createMockTable({
      maybeSingleResult: {
        data: {
          day_id: "day-1",
          final_score: 95,
          base_score: 70,
          bonus_score: 25,
          calculated_at: "2026-07-01T20:00:00.000Z",
        },
        error: null,
      },
    });
    const repository = new SupabaseScoreSnapshotRepository(
      createMockSupabaseClient({
        closed_day_score_snapshots: [snapshotsTable],
      }),
    );

    await expect(repository.getByDayId("user-1", "day-1")).resolves.toEqual({
      dayId: "day-1",
      finalScore: 95,
      baseScore: 70,
      bonusScore: 25,
      calculatedAt: "2026-07-01T20:00:00.000Z",
    });

    expect(snapshotsTable.calls.eq).toEqual([
      ["user_id", "user-1"],
      ["day_id", "day-1"],
    ]);
  });

  it("lists snapshots for owned day ids", async () => {
    const snapshotsTable = createMockTable({
      awaitResult: {
        data: [
          {
            day_id: "day-1",
            final_score: 95,
            base_score: 70,
            bonus_score: 25,
            calculated_at: "2026-07-01T20:00:00.000Z",
          },
          {
            day_id: "day-2",
            final_score: 80,
            base_score: 80,
            bonus_score: 0,
            calculated_at: "2026-07-02T20:00:00.000Z",
          },
        ],
        error: null,
      },
    });
    const repository = new SupabaseScoreSnapshotRepository(
      createMockSupabaseClient({
        closed_day_score_snapshots: [snapshotsTable],
      }),
    );

    await expect(
      repository.listByDayIds("user-1", ["day-1", "day-2"]),
    ).resolves.toEqual([
      {
        dayId: "day-1",
        finalScore: 95,
        baseScore: 70,
        bonusScore: 25,
        calculatedAt: "2026-07-01T20:00:00.000Z",
      },
      {
        dayId: "day-2",
        finalScore: 80,
        baseScore: 80,
        bonusScore: 0,
        calculatedAt: "2026-07-02T20:00:00.000Z",
      },
    ]);

    expect(snapshotsTable.calls.eq).toEqual([["user_id", "user-1"]]);
    expect(snapshotsTable.calls.in).toEqual([["day_id", ["day-1", "day-2"]]]);
  });
});
