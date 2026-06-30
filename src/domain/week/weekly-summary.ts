export type WeeklyDayState = "scored" | "excluded" | "unconfigured";

export interface WeekRange {
  startDate: string;
  endDate: string;
  dates: string[];
}

export interface ScoredWeekDay {
  date: string;
  state: "scored";
  finalScore: number;
}

export interface ExcludedWeekDay {
  date: string;
  state: "excluded";
}

export interface UnconfiguredWeekDay {
  date: string;
  state: "unconfigured";
}

export type WeeklyDayRecord = ScoredWeekDay | ExcludedWeekDay;
export type WeeklyDaySummary = WeeklyDayRecord | UnconfiguredWeekDay;

export interface WeeklyPerformance {
  averageScore: number | null;
  scoredDayCount: number;
}

export interface WeeklyConsistency {
  scoredDayCount: number;
  excludedDayCount: number;
  unconfiguredDayCount: number;
  totalDayCount: number;
}

export interface WeeklySummary {
  range: WeekRange;
  days: WeeklyDaySummary[];
  performance: WeeklyPerformance;
  consistency: WeeklyConsistency;
}

function parseDateString(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

export function getWeekRange(containingDate: string): WeekRange {
  const date = parseDateString(containingDate);
  const mondayBasedDayIndex = (date.getUTCDay() + 6) % 7;
  const startDate = addDays(date, -mondayBasedDayIndex);

  const dates = Array.from({ length: 7 }, (_, index) =>
    formatDate(addDays(startDate, index)),
  );

  return {
    startDate: dates[0],
    endDate: dates[6],
    dates,
  };
}

export function calculateWeeklyPerformance(
  days: WeeklyDaySummary[],
): WeeklyPerformance {
  const scoredDays = days.filter(
    (day): day is ScoredWeekDay => day.state === "scored",
  );

  if (scoredDays.length === 0) {
    return {
      averageScore: null,
      scoredDayCount: 0,
    };
  }

  const totalScore = scoredDays.reduce((sum, day) => sum + day.finalScore, 0);

  return {
    averageScore: totalScore / scoredDays.length,
    scoredDayCount: scoredDays.length,
  };
}

export function calculateWeeklyConsistency(
  days: WeeklyDaySummary[],
): WeeklyConsistency {
  return days.reduce<WeeklyConsistency>(
    (summary, day) => {
      if (day.state === "scored") {
        summary.scoredDayCount += 1;
      } else if (day.state === "excluded") {
        summary.excludedDayCount += 1;
      } else {
        summary.unconfiguredDayCount += 1;
      }

      return summary;
    },
    {
      scoredDayCount: 0,
      excludedDayCount: 0,
      unconfiguredDayCount: 0,
      totalDayCount: days.length,
    },
  );
}

export function buildWeeklySummary(
  containingDate: string,
  records: WeeklyDayRecord[],
): WeeklySummary {
  const range = getWeekRange(containingDate);
  const recordByDate = new Map(
    records
      .filter((record) => range.dates.includes(record.date))
      .map((record) => [record.date, record]),
  );

  const days = range.dates.map<WeeklyDaySummary>((date) => {
    const record = recordByDate.get(date);

    if (!record) {
      return {
        date,
        state: "unconfigured",
      };
    }

    return record;
  });

  return {
    range,
    days,
    performance: calculateWeeklyPerformance(days),
    consistency: calculateWeeklyConsistency(days),
  };
}
