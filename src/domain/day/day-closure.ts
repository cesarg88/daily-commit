import type { Day } from "./day";
import type { DailyObjective } from "./daily-objective";
import { MVP_TIMEZONE, toLocalDateString } from "../time/mvp-timezone";
export { MVP_TIMEZONE } from "../time/mvp-timezone";

export type DayClosureReason = "base-objectives-complete" | "midnight";

export interface DayClosureResult {
  day: Day;
  didClose: boolean;
  reason?: DayClosureReason;
}

function isObjectiveFullyComplete(objective: DailyObjective): boolean {
  if (objective.type === "binary") {
    return objective.isCompleted;
  }

  if (objective.targetValue <= 0) {
    return false;
  }

  return objective.currentValue >= objective.targetValue;
}

export function areBaseObjectivesComplete(
  objectives: DailyObjective[],
): boolean {
  const baseObjectives = objectives.filter(
    (objective) => objective.kind === "base",
  );

  return (
    baseObjectives.length > 0 && baseObjectives.every(isObjectiveFullyComplete)
  );
}

export function isMidnightClosureEligible(
  day: Day,
  currentDateTime: Date,
  timeZone: string = MVP_TIMEZONE,
): boolean {
  if (day.state !== "active") {
    return false;
  }

  return day.date < toLocalDateString(currentDateTime, timeZone);
}

export function determineDayClosureReason(
  day: Day,
  objectives: DailyObjective[],
  currentDateTime: Date,
  timeZone: string = MVP_TIMEZONE,
): DayClosureReason | undefined {
  if (day.state !== "active") {
    return undefined;
  }

  if (areBaseObjectivesComplete(objectives)) {
    return "base-objectives-complete";
  }

  if (isMidnightClosureEligible(day, currentDateTime, timeZone)) {
    return "midnight";
  }

  return undefined;
}

export function applyDayClosurePolicy(
  day: Day,
  objectives: DailyObjective[],
  currentDateTime: Date,
  timeZone: string = MVP_TIMEZONE,
): DayClosureResult {
  const reason = determineDayClosureReason(
    day,
    objectives,
    currentDateTime,
    timeZone,
  );

  if (!reason) {
    return {
      day,
      didClose: false,
    };
  }

  return {
    day: {
      ...day,
      state: "closed",
      closedAt: currentDateTime.toISOString(),
    },
    didClose: true,
    reason,
  };
}
