import type { DayRepository } from "../ports/day-repository";
import type { ScoreSnapshotRepository } from "../ports/score-snapshot-repository";
import {
  buildWeeklySummary,
  getWeekRange,
  type WeeklySummary,
  type WeeklyDayRecord,
} from "../../domain/week/weekly-summary";

export interface WeeklyReviewViewModel {
  containingDate: string;
  summary: WeeklySummary;
}

function mapDaysToWeeklyRecords(
  days: Awaited<ReturnType<DayRepository["listByDateRange"]>>,
  snapshotsByDayId: Map<
    string,
    Awaited<ReturnType<ScoreSnapshotRepository["listByDayIds"]>>[number]
  >,
): WeeklyDayRecord[] {
  return days.flatMap<WeeklyDayRecord>((day) => {
    if (day.state === "excluded") {
      return [
        {
          date: day.date,
          state: "excluded" as const,
        },
      ];
    }

    if (day.state !== "closed") {
      return [];
    }

    const snapshot = snapshotsByDayId.get(day.id);

    if (!snapshot) {
      throw new Error(`Missing score snapshot for closed day ${day.id}.`);
    }

    return [
      {
        date: day.date,
        state: "scored" as const,
        finalScore: snapshot.finalScore,
      },
    ];
  });
}

export async function getWeeklyReview(
  userId: string,
  containingDate: string,
  dayRepository: DayRepository,
  scoreSnapshotRepository: ScoreSnapshotRepository,
): Promise<WeeklyReviewViewModel> {
  const range = getWeekRange(containingDate);
  const days = await dayRepository.listByDateRange(
    userId,
    range.startDate,
    range.endDate,
  );
  const closedDayIds = days
    .filter((day) => day.state === "closed")
    .map((day) => day.id);
  const snapshots = await scoreSnapshotRepository.listByDayIds(
    userId,
    closedDayIds,
  );
  const snapshotsByDayId = new Map(
    snapshots.map((snapshot) => [snapshot.dayId, snapshot]),
  );

  return {
    containingDate,
    summary: buildWeeklySummary(
      containingDate,
      mapDaysToWeeklyRecords(days, snapshotsByDayId),
    ),
  };
}
