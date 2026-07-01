import { describe, expect, it } from "vitest";
import { SupabaseDayRepository } from "./supabase-day-repository";
import {
  createMockSupabaseClient,
  createMockTable,
} from "../../test/builders/supabase-client-builder";

describe("SupabaseDayRepository", () => {
  it("saves a day and replaces its daily objectives", async () => {
    const daysTable = createMockTable({
      singleResult: {
        data: {
          id: "day-1",
          date: "2026-07-01",
          state: "draft",
          closed_at: null,
        },
        error: null,
      },
    });
    const deleteDailyObjectivesTable = createMockTable({
      awaitResult: {
        data: null,
        error: null,
      },
    });
    const insertDailyObjectivesTable = createMockTable({
      awaitResult: {
        data: [
          {
            id: "daily-1",
            objective_id: "objective-1",
            name_snapshot: "Walk",
            type: "numeric",
            kind: "base",
            weight: 100,
            target_value: 8,
            current_value: 0,
            unit: "km",
            is_completed: false,
          },
        ],
        error: null,
      },
    });
    const repository = new SupabaseDayRepository(
      createMockSupabaseClient({
        days: [daysTable],
        daily_objectives: [
          deleteDailyObjectivesTable,
          insertDailyObjectivesTable,
        ],
      }),
    );

    await expect(
      repository.saveDay("user-1", {
        day: {
          id: "day-1",
          date: "2026-07-01",
          state: "draft",
        },
        objectives: [
          {
            id: "daily-1",
            objectiveId: "objective-1",
            nameSnapshot: "Walk",
            type: "numeric",
            kind: "base",
            weight: 100,
            targetValue: 8,
            currentValue: 0,
            unit: "km",
            isCompleted: false,
          },
        ],
      }),
    ).resolves.toEqual({
      day: {
        id: "day-1",
        date: "2026-07-01",
        state: "draft",
      },
      objectives: [
        {
          id: "daily-1",
          objectiveId: "objective-1",
          nameSnapshot: "Walk",
          type: "numeric",
          kind: "base",
          weight: 100,
          targetValue: 8,
          currentValue: 0,
          unit: "km",
          isCompleted: false,
        },
      ],
    });

    expect(daysTable.calls.upsert).toEqual([
      [
        {
          id: "day-1",
          user_id: "user-1",
          date: "2026-07-01",
          state: "draft",
          closed_at: null,
        },
        {
          onConflict: "id",
        },
      ],
    ]);
    expect(deleteDailyObjectivesTable.calls.eq).toEqual([
      ["user_id", "user-1"],
      ["day_id", "day-1"],
    ]);
  });

  it("gets a day by date with its owned daily objectives", async () => {
    const daysTable = createMockTable({
      maybeSingleResult: {
        data: {
          id: "day-1",
          date: "2026-07-01",
          state: "active",
          closed_at: null,
        },
        error: null,
      },
    });
    const dailyObjectivesTable = createMockTable({
      awaitResult: {
        data: [
          {
            id: "daily-1",
            objective_id: "objective-1",
            name_snapshot: "Sleep",
            type: "binary",
            kind: "base",
            weight: 40,
            target_value: null,
            current_value: null,
            unit: null,
            is_completed: true,
          },
        ],
        error: null,
      },
    });
    const repository = new SupabaseDayRepository(
      createMockSupabaseClient({
        days: [daysTable],
        daily_objectives: [dailyObjectivesTable],
      }),
    );

    await expect(repository.getByDate("user-1", "2026-07-01")).resolves.toEqual(
      {
        day: {
          id: "day-1",
          date: "2026-07-01",
          state: "active",
        },
        objectives: [
          {
            id: "daily-1",
            objectiveId: "objective-1",
            nameSnapshot: "Sleep",
            type: "binary",
            kind: "base",
            weight: 40,
            isCompleted: true,
          },
        ],
      },
    );

    expect(daysTable.calls.eq).toEqual([
      ["user_id", "user-1"],
      ["date", "2026-07-01"],
    ]);
    expect(dailyObjectivesTable.calls.eq).toEqual([
      ["user_id", "user-1"],
      ["day_id", "day-1"],
    ]);
  });

  it("lists owned days in a date range", async () => {
    const daysTable = createMockTable({
      awaitResult: {
        data: [
          {
            id: "day-1",
            date: "2026-07-01",
            state: "draft",
            closed_at: null,
          },
          {
            id: "day-2",
            date: "2026-07-02",
            state: "excluded",
            closed_at: null,
          },
        ],
        error: null,
      },
    });
    const repository = new SupabaseDayRepository(
      createMockSupabaseClient({
        days: [daysTable],
      }),
    );

    await expect(
      repository.listByDateRange("user-1", "2026-07-01", "2026-07-07"),
    ).resolves.toEqual([
      {
        id: "day-1",
        date: "2026-07-01",
        state: "draft",
      },
      {
        id: "day-2",
        date: "2026-07-02",
        state: "excluded",
      },
    ]);

    expect(daysTable.calls.eq).toEqual([["user_id", "user-1"]]);
    expect(daysTable.calls.gte).toEqual([["date", "2026-07-01"]]);
    expect(daysTable.calls.lte).toEqual([["date", "2026-07-07"]]);
  });

  it("lists active days before a date with their owning user and objectives", async () => {
    const daysTable = createMockTable({
      awaitResult: {
        data: [
          {
            id: "day-1",
            user_id: "user-1",
            date: "2026-07-01",
            state: "active",
            closed_at: null,
          },
        ],
        error: null,
      },
    });
    const dailyObjectivesTable = createMockTable({
      awaitResult: {
        data: [
          {
            id: "daily-1",
            objective_id: "objective-1",
            name_snapshot: "Sleep",
            type: "binary",
            kind: "base",
            weight: 100,
            target_value: null,
            current_value: null,
            unit: null,
            is_completed: false,
          },
        ],
        error: null,
      },
    });
    const repository = new SupabaseDayRepository(
      createMockSupabaseClient({
        days: [daysTable],
        daily_objectives: [dailyObjectivesTable],
      }),
    );

    await expect(
      repository.listActiveBeforeDate("2026-07-02", "user-1"),
    ).resolves.toEqual([
      {
        userId: "user-1",
        day: {
          id: "day-1",
          date: "2026-07-01",
          state: "active",
        },
        objectives: [
          {
            id: "daily-1",
            objectiveId: "objective-1",
            nameSnapshot: "Sleep",
            type: "binary",
            kind: "base",
            weight: 100,
            isCompleted: false,
          },
        ],
      },
    ]);

    expect(daysTable.calls.eq).toEqual([
      ["state", "active"],
      ["user_id", "user-1"],
    ]);
    expect(daysTable.calls.lt).toEqual([["date", "2026-07-02"]]);
    expect(dailyObjectivesTable.calls.eq).toEqual([
      ["user_id", "user-1"],
      ["day_id", "day-1"],
    ]);
  });
});
