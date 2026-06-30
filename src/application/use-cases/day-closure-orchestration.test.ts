import { describe, expect, it } from "vitest";
import {
  closeActiveDaysBeforeDate,
  closeDayIfEligible,
} from "./day-closure-orchestration";
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
import { createBinaryDailyObjective } from "../../test/builders/daily-objective-builder";

function createDayRepository(
  activeRecords: PersistedUserDayRecord[],
): DayRepository & {
  savedRecords: PersistedDayRecord[];
  updatedDays: Day[];
} {
  const savedRecords: PersistedDayRecord[] = [];
  const updatedDays: Day[] = [];

  return {
    savedRecords,
    updatedDays,
    async getByDate() {
      return null;
    },
    async listActiveBeforeDate(beforeDate: string, userId?: string) {
      return activeRecords.filter(
        (record) =>
          record.day.state === "active" &&
          record.day.date < beforeDate &&
          (!userId || record.userId === userId),
      );
    },
    async listByDateRange() {
      return activeRecords.map((record) => record.day);
    },
    async saveDay(_userId: string, record: PersistedDayRecord) {
      savedRecords.push(record);
      return record;
    },
    async updateDay(_userId: string, day: Day) {
      updatedDays.push(day);
      return day;
    },
  };
}

function createScoreSnapshotRepository(
  initialSnapshots: ClosedDayScoreSnapshot[] = [],
): ScoreSnapshotRepository & { upserts: ClosedDayScoreSnapshot[] } {
  const snapshots = new Map(
    initialSnapshots.map((snapshot) => [snapshot.dayId, snapshot]),
  );
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

function activeRecord(
  overrides: Partial<PersistedUserDayRecord> = {},
): PersistedUserDayRecord {
  return {
    userId: "user-1",
    day: {
      id: "day-1",
      date: "2026-07-01",
      state: "active",
    },
    objectives: [
      createBinaryDailyObjective({
        id: "base-1",
        kind: "base",
        weight: 70,
        isCompleted: true,
      }),
      createBinaryDailyObjective({
        id: "bonus-1",
        kind: "bonus",
        weight: 15,
        isCompleted: true,
      }),
    ],
    ...overrides,
  };
}

describe("day closure orchestration", () => {
  it("closes a base-complete day and stores a score snapshot", async () => {
    const dayRepository = createDayRepository([]);
    const snapshotRepository = createScoreSnapshotRepository();

    const result = await closeDayIfEligible(
      "user-1",
      activeRecord(),
      dayRepository,
      snapshotRepository,
      new Date("2026-07-01T10:00:00.000Z"),
    );

    expect(result).toMatchObject({
      status: "closed",
      record: {
        day: {
          state: "closed",
          closedAt: "2026-07-01T10:00:00.000Z",
        },
      },
    });
    expect(snapshotRepository.upserts).toEqual([
      {
        dayId: "day-1",
        finalScore: 85,
        baseScore: 70,
        bonusScore: 15,
        calculatedAt: "2026-07-01T10:00:00.000Z",
      },
    ]);
    expect(dayRepository.updatedDays).toEqual([
      expect.objectContaining({
        id: "day-1",
        state: "closed",
      }),
    ]);
  });

  it("closes midnight-eligible active days lazily before the current Madrid date", async () => {
    const dayRepository = createDayRepository([
      activeRecord({
        userId: "user-1",
        day: {
          id: "yesterday",
          date: "2026-07-01",
          state: "active",
        },
        objectives: [
          createBinaryDailyObjective({
            id: "base-pending",
            kind: "base",
            weight: 100,
            isCompleted: false,
          }),
        ],
      }),
      activeRecord({
        userId: "user-1",
        day: {
          id: "today",
          date: "2026-07-02",
          state: "active",
        },
      }),
    ]);
    const snapshotRepository = createScoreSnapshotRepository();

    const result = await closeActiveDaysBeforeDate(
      "2026-07-02",
      dayRepository,
      snapshotRepository,
      new Date("2026-07-01T22:30:00.000Z"),
      "user-1",
    );

    expect(result).toMatchObject({
      checkedDays: 1,
      closedDays: 1,
    });
    expect(snapshotRepository.upserts).toEqual([
      {
        dayId: "yesterday",
        finalScore: 0,
        baseScore: 0,
        bonusScore: 0,
        calculatedAt: "2026-07-01T22:30:00.000Z",
      },
    ]);
  });

  it("is idempotent for an already closed day with an existing snapshot", async () => {
    const record: PersistedDayRecord = {
      day: {
        id: "day-1",
        date: "2026-07-01",
        state: "closed",
        closedAt: "2026-07-01T10:00:00.000Z",
      },
      objectives: activeRecord().objectives,
    };
    const dayRepository = createDayRepository([]);
    const snapshotRepository = createScoreSnapshotRepository([
      {
        dayId: "day-1",
        finalScore: 85,
        baseScore: 70,
        bonusScore: 15,
        calculatedAt: "2026-07-01T10:00:00.000Z",
      },
    ]);

    const result = await closeDayIfEligible(
      "user-1",
      record,
      dayRepository,
      snapshotRepository,
      new Date("2026-07-01T10:05:00.000Z"),
    );

    expect(result.status).toBe("already-closed");
    expect(dayRepository.updatedDays).toEqual([]);
    expect(snapshotRepository.upserts).toEqual([]);
  });

  it("repairs a missing score snapshot when a closed day is retried", async () => {
    const record: PersistedDayRecord = {
      day: {
        id: "day-1",
        date: "2026-07-01",
        state: "closed",
        closedAt: "2026-07-01T10:00:00.000Z",
      },
      objectives: activeRecord().objectives,
    };
    const snapshotRepository = createScoreSnapshotRepository();

    await closeDayIfEligible(
      "user-1",
      record,
      createDayRepository([]),
      snapshotRepository,
      new Date("2026-07-01T10:05:00.000Z"),
    );

    expect(snapshotRepository.upserts).toEqual([
      {
        dayId: "day-1",
        finalScore: 85,
        baseScore: 70,
        bonusScore: 15,
        calculatedAt: "2026-07-01T10:00:00.000Z",
      },
    ]);
  });
});
