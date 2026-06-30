import type { DayRepository } from "../ports/day-repository";
import type { ScoreSnapshotRepository } from "../ports/score-snapshot-repository";
import {
  closeActiveDaysBeforeDate,
  saveDayAndCloseIfEligible,
} from "./day-closure-orchestration";
import type { DailyObjective } from "../../domain/day/daily-objective";
import type { Day } from "../../domain/day/day";
import {
  calculateScoreBreakdown,
  type ScoreBreakdown,
} from "../../domain/scoring/score-calculator";

export interface TodayExecutionViewModel {
  date: string;
  day: Day | null;
  objectives: DailyObjective[];
  baseObjectives: DailyObjective[];
  bonusObjectives: DailyObjective[];
  pendingBaseObjectives: DailyObjective[];
  score: ScoreBreakdown;
  canUpdateProgress: boolean;
}

export type TodayProgressUpdateInput =
  | {
      date: string;
      objectiveId: string;
      type: "binary";
      isCompleted: boolean;
    }
  | {
      date: string;
      objectiveId: string;
      type: "numeric";
      currentValue: number;
    };

export type TodayProgressUpdateResult =
  | {
      status: "updated";
      model: TodayExecutionViewModel;
      didCloseDay: boolean;
    }
  | {
      status: "not-active";
      model: TodayExecutionViewModel;
    }
  | {
      status: "objective-not-found";
      model: TodayExecutionViewModel;
    };

function emptyScore(): ScoreBreakdown {
  return {
    baseScore: 0,
    bonusScore: 0,
    finalScore: 0,
  };
}

function isObjectiveIncomplete(objective: DailyObjective): boolean {
  if (objective.type === "binary") {
    return !objective.isCompleted;
  }

  return (
    objective.targetValue <= 0 || objective.currentValue < objective.targetValue
  );
}

function buildTodayExecutionViewModel(
  date: string,
  day: Day | null,
  objectives: DailyObjective[],
): TodayExecutionViewModel {
  const baseObjectives = objectives.filter(
    (objective) => objective.kind === "base",
  );
  const bonusObjectives = objectives.filter(
    (objective) => objective.kind === "bonus",
  );

  return {
    date,
    day,
    objectives,
    baseObjectives,
    bonusObjectives,
    pendingBaseObjectives: baseObjectives.filter(isObjectiveIncomplete),
    score:
      objectives.length > 0
        ? calculateScoreBreakdown(objectives)
        : emptyScore(),
    canUpdateProgress: day?.state === "active",
  };
}

function updateObjectiveProgress(
  objective: DailyObjective,
  input: TodayProgressUpdateInput,
): DailyObjective {
  if (objective.id !== input.objectiveId) {
    return objective;
  }

  if (objective.type === "binary" && input.type === "binary") {
    return {
      ...objective,
      isCompleted: input.isCompleted,
    };
  }

  if (objective.type === "numeric" && input.type === "numeric") {
    const currentValue = Math.max(0, input.currentValue);

    return {
      ...objective,
      currentValue,
      isCompleted:
        objective.targetValue > 0 && currentValue >= objective.targetValue,
    };
  }

  return objective;
}

async function getTodayRecord(
  userId: string,
  date: string,
  dayRepository: DayRepository,
) {
  return dayRepository.getByDate(userId, date);
}

export async function getTodayExecution(
  userId: string,
  date: string,
  dayRepository: DayRepository,
  scoreSnapshotRepository: ScoreSnapshotRepository,
  currentDateTime: Date = new Date(),
): Promise<TodayExecutionViewModel> {
  await closeActiveDaysBeforeDate(
    date,
    dayRepository,
    scoreSnapshotRepository,
    currentDateTime,
    userId,
  );

  const record = await getTodayRecord(userId, date, dayRepository);

  return buildTodayExecutionViewModel(
    date,
    record?.day ?? null,
    record?.objectives ?? [],
  );
}

export async function updateTodayProgress(
  userId: string,
  input: TodayProgressUpdateInput,
  dayRepository: DayRepository,
  scoreSnapshotRepository: ScoreSnapshotRepository,
  currentDateTime: Date = new Date(),
): Promise<TodayProgressUpdateResult> {
  const record = await getTodayRecord(userId, input.date, dayRepository);
  const initialModel = buildTodayExecutionViewModel(
    input.date,
    record?.day ?? null,
    record?.objectives ?? [],
  );

  if (!record || record.day.state !== "active") {
    return {
      status: "not-active",
      model: initialModel,
    };
  }

  if (
    !record.objectives.some((objective) => objective.id === input.objectiveId)
  ) {
    return {
      status: "objective-not-found",
      model: initialModel,
    };
  }

  const updatedObjectives = record.objectives.map((objective) =>
    updateObjectiveProgress(objective, input),
  );
  const orchestration = await saveDayAndCloseIfEligible(
    userId,
    {
      day: record.day,
      objectives: updatedObjectives,
    },
    dayRepository,
    scoreSnapshotRepository,
    currentDateTime,
  );

  const savedRecord = orchestration.record;

  return {
    status: "updated",
    model: buildTodayExecutionViewModel(
      input.date,
      savedRecord.day,
      savedRecord.objectives,
    ),
    didCloseDay: orchestration.status === "closed",
  };
}
