import type { DailyObjective } from "../../domain/day/daily-objective";
import type { Day } from "../../domain/day/day";

export interface PersistedDayRecord {
  day: Day;
  objectives: DailyObjective[];
}

export interface DayRepository {
  getByDate(userId: string, date: string): Promise<PersistedDayRecord | null>;
  listByDateRange(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<Day[]>;
  saveDay(
    userId: string,
    record: PersistedDayRecord,
  ): Promise<PersistedDayRecord>;
  updateDay(userId: string, day: Day): Promise<Day>;
}
