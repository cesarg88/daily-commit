export type DayState =
  "unconfigured" | "draft" | "active" | "closed" | "excluded";

export interface Day {
  id: string;
  date: string;
  state: DayState;
  closedAt?: string;
}
