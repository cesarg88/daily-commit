import { describe, expect, it } from "vitest";
import {
  excludeDay,
  getDayConfiguration,
  saveDayConfiguration,
} from "./day-configuration";
import type {
  DayRepository,
  PersistedDayRecord,
} from "../ports/day-repository";
import type { ObjectiveRepository } from "../ports/objective-repository";
import type { Objective } from "../../domain/objective/objective";
import type { Day } from "../../domain/day/day";

function createObjectiveRepository(
  objectives: Objective[],
): ObjectiveRepository {
  return {
    async create() {
      throw new Error("Not used in day configuration tests.");
    },
    async getById(_userId: string, objectiveId: string) {
      return (
        objectives.find((objective) => objective.id === objectiveId) ?? null
      );
    },
    async listByUser() {
      return objectives;
    },
    async update() {
      throw new Error("Not used in day configuration tests.");
    },
  };
}

function createDayRepository(
  initialRecord: PersistedDayRecord | null = null,
): DayRepository & { savedRecords: PersistedDayRecord[] } {
  let record = initialRecord;
  const savedRecords: PersistedDayRecord[] = [];

  return {
    savedRecords,
    async getByDate() {
      return record;
    },
    async listActiveBeforeDate() {
      return [];
    },
    async listByDateRange() {
      return record ? [record.day] : [];
    },
    async saveDay(_userId: string, nextRecord: PersistedDayRecord) {
      record = nextRecord;
      savedRecords.push(nextRecord);
      return nextRecord;
    },
    async updateDay(_userId: string, day: Day) {
      record = {
        day,
        objectives: record?.objectives ?? [],
      };
      return day;
    },
  };
}

const catalog: Objective[] = [
  {
    id: "objective-1",
    name: "Read",
    type: "binary",
    isActive: true,
  },
  {
    id: "objective-2",
    name: "Walk",
    type: "numeric",
    isActive: true,
    defaultTargetValue: 8,
    defaultUnit: "km",
  },
  {
    id: "objective-3",
    name: "Sleep",
    type: "binary",
    isActive: true,
  },
  {
    id: "bonus-1",
    name: "Stretch",
    type: "binary",
    isActive: true,
  },
];

describe("day configuration use cases", () => {
  it("blocks activation when the base total is invalid", async () => {
    const result = await saveDayConfiguration(
      "user-1",
      {
        date: "2026-07-01",
        targetState: "active",
        selectedObjectives: [
          { objectiveId: "objective-1", kind: "base", weight: 40 },
          { objectiveId: "objective-2", kind: "base", weight: 30 },
          { objectiveId: "objective-3", kind: "base", weight: 20 },
        ],
      },
      createObjectiveRepository(catalog),
      createDayRepository(),
      () => "daily-id",
    );

    expect(result).toEqual({
      status: "invalid",
      validation: {
        isValid: false,
        baseObjectiveCount: 3,
        baseWeightTotal: 90,
        issues: [{ code: "base-weight-total-below-100" }],
      },
    });
  });

  it("blocks activation with fewer than three base objectives", async () => {
    const result = await saveDayConfiguration(
      "user-1",
      {
        date: "2026-07-01",
        targetState: "active",
        selectedObjectives: [
          { objectiveId: "objective-1", kind: "base", weight: 50 },
          { objectiveId: "objective-2", kind: "base", weight: 50 },
          { objectiveId: "bonus-1", kind: "bonus", weight: 20 },
        ],
      },
      createObjectiveRepository(catalog),
      createDayRepository(),
      () => "daily-id",
    );

    expect(result).toMatchObject({
      status: "invalid",
      validation: {
        isValid: false,
        baseObjectiveCount: 2,
        baseWeightTotal: 100,
        issues: [{ code: "insufficient-base-objectives" }],
      },
    });
  });

  it("activates a valid day configuration", async () => {
    let id = 0;
    const result = await saveDayConfiguration(
      "user-1",
      {
        date: "2026-07-01",
        targetState: "active",
        selectedObjectives: [
          { objectiveId: "objective-1", kind: "base", weight: 30 },
          { objectiveId: "objective-2", kind: "base", weight: 40 },
          { objectiveId: "objective-3", kind: "base", weight: 30 },
          { objectiveId: "bonus-1", kind: "bonus", weight: 10 },
        ],
      },
      createObjectiveRepository(catalog),
      createDayRepository(),
      () => `daily-${++id}`,
    );

    expect(result).toMatchObject({
      status: "saved",
      record: {
        day: {
          date: "2026-07-01",
          state: "active",
        },
        objectives: [
          expect.objectContaining({
            id: "daily-1",
            objectiveId: "objective-1",
            nameSnapshot: "Read",
            type: "binary",
            kind: "base",
            weight: 30,
            isCompleted: false,
          }),
          expect.objectContaining({
            id: "daily-2",
            objectiveId: "objective-2",
            nameSnapshot: "Walk",
            type: "numeric",
            kind: "base",
            weight: 40,
            targetValue: 8,
            currentValue: 0,
            unit: "km",
            isCompleted: false,
          }),
          expect.objectContaining({
            id: "daily-3",
            objectiveId: "objective-3",
            kind: "base",
            weight: 30,
          }),
          expect.objectContaining({
            id: "daily-4",
            objectiveId: "bonus-1",
            kind: "bonus",
            weight: 10,
          }),
        ],
      },
    });
  });

  it("does not let bonus objectives affect the base total", async () => {
    const viewModel = await getDayConfiguration(
      "user-1",
      "2026-07-01",
      createObjectiveRepository(catalog),
      createDayRepository({
        day: {
          id: "day-1",
          date: "2026-07-01",
          state: "draft",
        },
        objectives: [
          {
            id: "daily-1",
            objectiveId: "objective-1",
            nameSnapshot: "Read",
            type: "binary",
            kind: "base",
            weight: 100,
            isCompleted: false,
          },
          {
            id: "daily-2",
            objectiveId: "bonus-1",
            nameSnapshot: "Stretch",
            type: "binary",
            kind: "bonus",
            weight: 100,
            isCompleted: false,
          },
        ],
      }),
    );

    expect(viewModel.validation.baseWeightTotal).toBe(100);
  });

  it("persists an excluded day distinctly from unconfigured days", async () => {
    const repository = createDayRepository();

    await expect(
      excludeDay("user-1", "2026-07-01", repository),
    ).resolves.toMatchObject({
      date: "2026-07-01",
      state: "excluded",
    });
    expect(repository.savedRecords).toHaveLength(1);
    expect(repository.savedRecords[0].objectives).toEqual([]);
  });

  it("requires acknowledgement before editing an active day", async () => {
    const result = await saveDayConfiguration(
      "user-1",
      {
        date: "2026-07-01",
        targetState: "active",
        selectedObjectives: [
          { objectiveId: "objective-1", kind: "base", weight: 30 },
          { objectiveId: "objective-2", kind: "base", weight: 40 },
          { objectiveId: "objective-3", kind: "base", weight: 30 },
        ],
      },
      createObjectiveRepository(catalog),
      createDayRepository({
        day: {
          id: "day-1",
          date: "2026-07-01",
          state: "active",
        },
        objectives: [],
      }),
    );

    expect(result).toEqual({
      status: "requires-active-edit-acknowledgement",
    });
  });
});
