import { describe, expect, it } from "vitest";
import { getTodayExecution, updateTodayProgress } from "./today-execution";
import type {
  DayRepository,
  PersistedDayRecord,
  PersistedUserDayRecord,
} from "../ports/day-repository";
import type {
  ClosedDayScoreSnapshot,
  ScoreSnapshotRepository,
} from "../ports/score-snapshot-repository";
import type { Day } from "../../domain/day/day";
import {
  createBinaryDailyObjective,
  createNumericDailyObjective,
} from "../../test/builders/daily-objective-builder";

function createDayRepository(
  initialRecord: PersistedDayRecord | null,
  activeRecords: PersistedUserDayRecord[] = [],
): DayRepository & {
  savedRecords: PersistedDayRecord[];
  updatedDays: Day[];
} {
  let record = initialRecord;
  const savedRecords: PersistedDayRecord[] = [];
  const updatedDays: Day[] = [];

  return {
    savedRecords,
    updatedDays,
    async getByDate() {
      return record;
    },
    async listActiveBeforeDate(beforeDate: string, userId?: string) {
      return activeRecords.filter(
        (activeRecord) =>
          activeRecord.day.date < beforeDate &&
          (!userId || activeRecord.userId === userId),
      );
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
      updatedDays.push(day);
      return day;
    },
  };
}

function createScoreSnapshotRepository(): ScoreSnapshotRepository & {
  upserts: ClosedDayScoreSnapshot[];
} {
  const snapshots = new Map<string, ClosedDayScoreSnapshot>();
  const upserts: ClosedDayScoreSnapshot[] = [];

  return {
    upserts,
    async getByDayId(_userId: string, dayId: string) {
      return snapshots.get(dayId) ?? null;
    },
    async listByDayIds(_userId: string, dayIds: string[]) {
      return dayIds.flatMap((dayId) => {
        const snapshot = snapshots.get(dayId);

        return snapshot ? [snapshot] : [];
      });
    },
    async upsert(_userId: string, snapshot: ClosedDayScoreSnapshot) {
      snapshots.set(snapshot.dayId, snapshot);
      upserts.push(snapshot);
      return snapshot;
    },
  };
}

function activeDayRecord(
  objectives: PersistedDayRecord["objectives"],
): PersistedDayRecord {
  return {
    day: {
      id: "day-1",
      date: "2026-07-01",
      state: "active",
    },
    objectives,
  };
}

describe("today execution use cases", () => {
  it("updates a binary objective and changes the score", async () => {
    const repository = createDayRepository(
      activeDayRecord([
        createBinaryDailyObjective({
          id: "base-1",
          weight: 40,
          isCompleted: false,
        }),
        createBinaryDailyObjective({
          id: "base-2",
          weight: 60,
          isCompleted: false,
        }),
      ]),
    );

    const result = await updateTodayProgress(
      "user-1",
      {
        date: "2026-07-01",
        objectiveId: "base-1",
        type: "binary",
        isCompleted: true,
      },
      repository,
      createScoreSnapshotRepository(),
      new Date("2026-07-01T10:00:00.000Z"),
    );

    expect(result).toMatchObject({
      status: "updated",
      didCloseDay: false,
      model: {
        score: {
          baseScore: 40,
          bonusScore: 0,
          finalScore: 40,
        },
      },
    });
    expect(repository.savedRecords[0].objectives[0]).toMatchObject({
      id: "base-1",
      isCompleted: true,
    });
  });

  it("updates a numeric objective proportionally and exposes the immediate final score", async () => {
    const repository = createDayRepository(
      activeDayRecord([
        createNumericDailyObjective({
          id: "base-numeric",
          weight: 50,
          targetValue: 10,
          currentValue: 0,
          isCompleted: false,
        }),
        createBinaryDailyObjective({
          id: "base-binary",
          weight: 50,
          isCompleted: false,
        }),
      ]),
    );

    const result = await updateTodayProgress(
      "user-1",
      {
        date: "2026-07-01",
        objectiveId: "base-numeric",
        type: "numeric",
        currentValue: 5,
      },
      repository,
      createScoreSnapshotRepository(),
      new Date("2026-07-01T10:00:00.000Z"),
    );

    expect(result).toMatchObject({
      status: "updated",
      model: {
        score: {
          baseScore: 25,
          bonusScore: 0,
          finalScore: 25,
        },
      },
    });
  });

  it("shows base score and bonus score separately", async () => {
    const model = await getTodayExecution(
      "user-1",
      "2026-07-01",
      createDayRepository(
        activeDayRecord([
          createBinaryDailyObjective({
            id: "base-1",
            kind: "base",
            weight: 70,
            isCompleted: true,
          }),
          createBinaryDailyObjective({
            id: "bonus-1",
            kind: "bonus",
            weight: 20,
            isCompleted: true,
          }),
        ]),
      ),
      createScoreSnapshotRepository(),
    );

    expect(model.score).toEqual({
      baseScore: 70,
      bonusScore: 20,
      finalScore: 90,
    });
  });

  it("keeps incomplete base objectives visible when bonus compensation caps final score at 100", async () => {
    const model = await getTodayExecution(
      "user-1",
      "2026-07-01",
      createDayRepository(
        activeDayRecord([
          createBinaryDailyObjective({
            id: "base-complete",
            kind: "base",
            weight: 80,
            isCompleted: true,
          }),
          createBinaryDailyObjective({
            id: "base-pending",
            kind: "base",
            weight: 20,
            isCompleted: false,
          }),
          createBinaryDailyObjective({
            id: "bonus-complete",
            kind: "bonus",
            weight: 30,
            isCompleted: true,
          }),
        ]),
      ),
      createScoreSnapshotRepository(),
    );

    expect(model.score).toEqual({
      baseScore: 80,
      bonusScore: 30,
      finalScore: 100,
    });
    expect(model.pendingBaseObjectives).toEqual([
      expect.objectContaining({
        id: "base-pending",
      }),
    ]);
    expect(model.baseObjectives.map((objective) => objective.id)).toEqual([
      "base-complete",
      "base-pending",
    ]);
  });

  it("auto-closes the day with a score snapshot when the last base objective is completed", async () => {
    const repository = createDayRepository(
      activeDayRecord([
        createBinaryDailyObjective({
          id: "base-complete",
          kind: "base",
          weight: 50,
          isCompleted: true,
        }),
        createBinaryDailyObjective({
          id: "base-final",
          kind: "base",
          weight: 50,
          isCompleted: false,
        }),
        createBinaryDailyObjective({
          id: "bonus-pending",
          kind: "bonus",
          weight: 20,
          isCompleted: false,
        }),
      ]),
    );
    const snapshotRepository = createScoreSnapshotRepository();

    const result = await updateTodayProgress(
      "user-1",
      {
        date: "2026-07-01",
        objectiveId: "base-final",
        type: "binary",
        isCompleted: true,
      },
      repository,
      snapshotRepository,
      new Date("2026-07-01T10:00:00.000Z"),
    );

    expect(result).toMatchObject({
      status: "updated",
      didCloseDay: true,
      model: {
        day: {
          state: "closed",
          closedAt: "2026-07-01T10:00:00.000Z",
        },
        score: {
          baseScore: 100,
          bonusScore: 0,
          finalScore: 100,
        },
      },
    });
    expect(repository.savedRecords[0].day).toMatchObject({
      state: "closed",
      closedAt: "2026-07-01T10:00:00.000Z",
    });
    expect(snapshotRepository.upserts).toEqual([
      {
        dayId: "day-1",
        finalScore: 100,
        baseScore: 100,
        bonusScore: 0,
        calculatedAt: "2026-07-01T10:00:00.000Z",
      },
    ]);
  });

  it("lazily closes earlier active days before loading Today", async () => {
    const repository = createDayRepository(null, [
      {
        userId: "user-1",
        day: {
          id: "yesterday",
          date: "2026-07-01",
          state: "active",
        },
        objectives: [
          createBinaryDailyObjective({
            id: "base-1",
            kind: "base",
            weight: 100,
            isCompleted: false,
          }),
        ],
      },
    ]);
    const snapshotRepository = createScoreSnapshotRepository();

    await getTodayExecution(
      "user-1",
      "2026-07-02",
      repository,
      snapshotRepository,
      new Date("2026-07-01T22:30:00.000Z"),
    );

    expect(repository.updatedDays).toEqual([
      expect.objectContaining({
        id: "yesterday",
        state: "closed",
      }),
    ]);
    expect(snapshotRepository.upserts).toEqual([
      expect.objectContaining({
        dayId: "yesterday",
        finalScore: 0,
      }),
    ]);
  });
});
