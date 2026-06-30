import type { DailyObjective } from "../../domain/day/daily-objective";
import type { Day } from "../../domain/day/day";

export interface PersistedDayRecord {
  day: Day;
  objectives: DailyObjective[];
}

export interface PersistedUserDayRecord extends PersistedDayRecord {
  userId: string;
}

export interface DayRepository {
  getByDate(userId: string, date: string): Promise<PersistedDayRecord | null>;
  listActiveBeforeDate(
    beforeDate: string,
    userId?: string,
  ): Promise<PersistedUserDayRecord[]>;
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
