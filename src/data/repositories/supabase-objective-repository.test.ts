import { describe, expect, it } from "vitest";
import { SupabaseObjectiveRepository } from "./supabase-objective-repository";
import {
  createMockSupabaseClient,
  createMockTable,
} from "../../test/builders/supabase-client-builder";

describe("SupabaseObjectiveRepository", () => {
  it("creates an owned objective", async () => {
    const objectivesTable = createMockTable({
      singleResult: {
        data: {
          id: "objective-1",
          name: "Walk",
          type: "numeric",
          is_active: true,
          default_target_value: 8,
          default_unit: "km",
          default_weight: 30,
        },
        error: null,
      },
    });
    const repository = new SupabaseObjectiveRepository(
      createMockSupabaseClient({
        objectives: [objectivesTable],
      }),
    );

    await expect(
      repository.create("user-1", {
        name: "Walk",
        type: "numeric",
        isActive: true,
        defaultTargetValue: 8,
        defaultUnit: "km",
        defaultWeight: 30,
      }),
    ).resolves.toEqual({
      id: "objective-1",
      name: "Walk",
      type: "numeric",
      isActive: true,
      defaultTargetValue: 8,
      defaultUnit: "km",
      defaultWeight: 30,
    });

    expect(objectivesTable.calls.insert).toEqual([
      [
        {
          user_id: "user-1",
          name: "Walk",
          type: "numeric",
          is_active: true,
          default_target_value: 8,
          default_unit: "km",
          default_weight: 30,
        },
      ],
    ]);
  });

  it("lists owned objectives in creation order", async () => {
    const objectivesTable = createMockTable({
      awaitResult: {
        data: [
          {
            id: "objective-1",
            name: "Walk",
            type: "numeric",
            is_active: true,
            default_target_value: 8,
            default_unit: "km",
            default_weight: 30,
          },
          {
            id: "objective-2",
            name: "Sleep",
            type: "binary",
            is_active: false,
            default_target_value: null,
            default_unit: null,
            default_weight: null,
          },
        ],
        error: null,
      },
    });
    const repository = new SupabaseObjectiveRepository(
      createMockSupabaseClient({
        objectives: [objectivesTable],
      }),
    );

    await expect(repository.listByUser("user-1")).resolves.toEqual([
      {
        id: "objective-1",
        name: "Walk",
        type: "numeric",
        isActive: true,
        defaultTargetValue: 8,
        defaultUnit: "km",
        defaultWeight: 30,
      },
      {
        id: "objective-2",
        name: "Sleep",
        type: "binary",
        isActive: false,
      },
    ]);

    expect(objectivesTable.calls.eq).toEqual([["user_id", "user-1"]]);
    expect(objectivesTable.calls.order).toEqual([
      ["created_at", { ascending: true }],
    ]);
  });

  it("updates only the owned objective row", async () => {
    const objectivesTable = createMockTable({
      singleResult: {
        data: {
          id: "objective-1",
          name: "Sleep",
          type: "binary",
          is_active: false,
          default_target_value: null,
          default_unit: null,
          default_weight: 20,
        },
        error: null,
      },
    });
    const repository = new SupabaseObjectiveRepository(
      createMockSupabaseClient({
        objectives: [objectivesTable],
      }),
    );

    await expect(
      repository.update("user-1", {
        id: "objective-1",
        name: "Sleep",
        type: "binary",
        isActive: false,
        defaultWeight: 20,
      }),
    ).resolves.toEqual({
      id: "objective-1",
      name: "Sleep",
      type: "binary",
      isActive: false,
      defaultWeight: 20,
    });

    expect(objectivesTable.calls.eq).toEqual([
      ["user_id", "user-1"],
      ["id", "objective-1"],
    ]);
  });
});
