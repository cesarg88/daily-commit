import { describe, expect, it } from "vitest";
import { getWeeklyReview } from "./weekly-review";
import type { DayRepository } from "../ports/day-repository";
import type {
  ClosedDayScoreSnapshot,
  ScoreSnapshotRepository,
} from "../ports/score-snapshot-repository";
import type { Day } from "../../domain/day/day";

function createDayRepository(days: Day[]): DayRepository {
  return {
    async getByDate() {
      return null;
    },
    async listActiveBeforeDate() {
      return [];
    },
    async listByDateRange() {
      return days;
    },
    async saveDay() {
      throw new Error("Not used in weekly review tests.");
    },
    async updateDay() {
      throw new Error("Not used in weekly review tests.");
    },
  };
}

function createScoreSnapshotRepository(
  snapshots: ClosedDayScoreSnapshot[],
): ScoreSnapshotRepository {
  return {
    async getByDayId(_userId: string, dayId: string) {
      return snapshots.find((snapshot) => snapshot.dayId === dayId) ?? null;
    },
    async listByDayIds(_userId: string, dayIds: string[]) {
      return snapshots.filter((snapshot) => dayIds.includes(snapshot.dayId));
    },
    async upsert() {
      throw new Error("Not used in weekly review tests.");
    },
  };
}

describe("getWeeklyReview", () => {
  it("uses Monday-first week range and weekly performance from scored days only", async () => {
    const model = await getWeeklyReview(
      "user-1",
      "2026-07-01",
      createDayRepository([
        { id: "day-1", date: "2026-06-29", state: "closed" },
        { id: "day-2", date: "2026-06-30", state: "closed" },
        { id: "day-3", date: "2026-07-02", state: "excluded" },
        { id: "day-4", date: "2026-07-03", state: "draft" },
        { id: "day-5", date: "2026-07-04", state: "active" },
      ]),
      createScoreSnapshotRepository([
        {
          dayId: "day-1",
          finalScore: 80,
          baseScore: 80,
          bonusScore: 0,
          calculatedAt: "2026-06-29T22:00:00.000Z",
        },
        {
          dayId: "day-2",
          finalScore: 100,
          baseScore: 90,
          bonusScore: 10,
          calculatedAt: "2026-06-30T22:00:00.000Z",
        },
      ]),
    );

    expect(model.summary.range).toEqual({
      startDate: "2026-06-29",
      endDate: "2026-07-05",
      dates: [
        "2026-06-29",
        "2026-06-30",
        "2026-07-01",
        "2026-07-02",
        "2026-07-03",
        "2026-07-04",
        "2026-07-05",
      ],
    });
    expect(model.summary.performance).toEqual({
      averageScore: 90,
      scoredDayCount: 2,
    });
  });

  it("shows scored, excluded, and unconfigured day states separately", async () => {
    const model = await getWeeklyReview(
      "user-1",
      "2026-07-01",
      createDayRepository([
        { id: "day-1", date: "2026-06-29", state: "closed" },
        { id: "day-2", date: "2026-07-02", state: "excluded" },
        { id: "day-3", date: "2026-07-03", state: "active" },
      ]),
      createScoreSnapshotRepository([
        {
          dayId: "day-1",
          finalScore: 75,
          baseScore: 75,
          bonusScore: 0,
          calculatedAt: "2026-06-29T22:00:00.000Z",
        },
      ]),
    );

    expect(model.summary.days).toEqual([
      { date: "2026-06-29", state: "scored", finalScore: 75 },
      { date: "2026-06-30", state: "unconfigured" },
      { date: "2026-07-01", state: "unconfigured" },
      { date: "2026-07-02", state: "excluded" },
      { date: "2026-07-03", state: "unconfigured" },
      { date: "2026-07-04", state: "unconfigured" },
      { date: "2026-07-05", state: "unconfigured" },
    ]);
    expect(model.summary.consistency).toEqual({
      scoredDayCount: 1,
      excludedDayCount: 1,
      unconfiguredDayCount: 5,
      totalDayCount: 7,
    });
  });

  it("throws if a closed day is missing its required score snapshot", async () => {
    await expect(
      getWeeklyReview(
        "user-1",
        "2026-07-01",
        createDayRepository([
          { id: "day-1", date: "2026-06-29", state: "closed" },
        ]),
        createScoreSnapshotRepository([]),
      ),
    ).rejects.toThrow("Missing score snapshot for closed day day-1.");
  });
});
