import type { Day } from "./day";
import type { DailyObjective } from "./daily-objective";

export const MVP_TIMEZONE = "Europe/Madrid";

export type DayClosureReason = "base-objectives-complete" | "midnight";

export interface DayClosureResult {
  day: Day;
  didClose: boolean;
  reason?: DayClosureReason;
}

function toLocalDateString(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Unable to derive local date parts for closure policy.");
  }

  return `${year}-${month}-${day}`;
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
