import type {
  DayRepository,
  PersistedDayRecord,
} from "../ports/day-repository";
import type { ScoreSnapshotRepository } from "../ports/score-snapshot-repository";
import { applyDayClosurePolicy } from "../../domain/day/day-closure";
import { calculateScoreBreakdown } from "../../domain/scoring/score-calculator";

export type DayClosureOrchestrationStatus =
  "closed" | "already-closed" | "not-eligible";

export interface DayClosureOrchestrationResult {
  status: DayClosureOrchestrationStatus;
  record: PersistedDayRecord;
}

export interface CloseActiveDaysResult {
  checkedDays: number;
  closedDays: number;
  results: DayClosureOrchestrationResult[];
}

async function upsertClosedDayScoreSnapshot(
  userId: string,
  record: PersistedDayRecord,
  scoreSnapshotRepository: ScoreSnapshotRepository,
  calculatedAt: string,
) {
  const score = calculateScoreBreakdown(record.objectives);

  return scoreSnapshotRepository.upsert(userId, {
    dayId: record.day.id,
    finalScore: score.finalScore,
    baseScore: score.baseScore,
    bonusScore: score.bonusScore,
    calculatedAt,
  });
}

export async function closeDayIfEligible(
  userId: string,
  record: PersistedDayRecord,
  dayRepository: DayRepository,
  scoreSnapshotRepository: ScoreSnapshotRepository,
  currentDateTime: Date = new Date(),
): Promise<DayClosureOrchestrationResult> {
  if (record.day.state === "closed") {
    const existingSnapshot = await scoreSnapshotRepository.getByDayId(
      userId,
      record.day.id,
    );

    if (!existingSnapshot) {
      await upsertClosedDayScoreSnapshot(
        userId,
        record,
        scoreSnapshotRepository,
        record.day.closedAt ?? currentDateTime.toISOString(),
      );
    }

    return {
      status: "already-closed",
      record,
    };
  }

  const closure = applyDayClosurePolicy(
    record.day,
    record.objectives,
    currentDateTime,
  );

  if (!closure.didClose) {
    return {
      status: "not-eligible",
      record,
    };
  }

  const closedRecord = {
    day: closure.day,
    objectives: record.objectives,
  };

  await upsertClosedDayScoreSnapshot(
    userId,
    closedRecord,
    scoreSnapshotRepository,
    closure.day.closedAt ?? currentDateTime.toISOString(),
  );

  return {
    status: "closed",
    record: {
      day: await dayRepository.updateDay(userId, closure.day),
      objectives: record.objectives,
    },
  };
}

export async function saveDayAndCloseIfEligible(
  userId: string,
  record: PersistedDayRecord,
  dayRepository: DayRepository,
  scoreSnapshotRepository: ScoreSnapshotRepository,
  currentDateTime: Date = new Date(),
): Promise<DayClosureOrchestrationResult> {
  const closure = applyDayClosurePolicy(
    record.day,
    record.objectives,
    currentDateTime,
  );
  const recordToSave = {
    day: closure.day,
    objectives: record.objectives,
  };

  if (closure.didClose) {
    await upsertClosedDayScoreSnapshot(
      userId,
      recordToSave,
      scoreSnapshotRepository,
      closure.day.closedAt ?? currentDateTime.toISOString(),
    );
  }

  const savedRecord = await dayRepository.saveDay(userId, recordToSave);

  return {
    status: closure.didClose ? "closed" : "not-eligible",
    record: savedRecord,
  };
}

export async function closeActiveDaysBeforeDate(
  beforeDate: string,
  dayRepository: DayRepository,
  scoreSnapshotRepository: ScoreSnapshotRepository,
  currentDateTime: Date = new Date(),
  userId?: string,
): Promise<CloseActiveDaysResult> {
  const activeRecords = await dayRepository.listActiveBeforeDate(
    beforeDate,
    userId,
  );
  const results = await Promise.all(
    activeRecords.map((record) =>
      closeDayIfEligible(
        record.userId,
        record,
        dayRepository,
        scoreSnapshotRepository,
        currentDateTime,
      ),
    ),
  );

  return {
    checkedDays: activeRecords.length,
    closedDays: results.filter((result) => result.status === "closed").length,
    results,
  };
}
