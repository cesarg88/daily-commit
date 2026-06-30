export interface ClosedDayScoreSnapshot {
  dayId: string;
  finalScore: number;
  baseScore: number;
  bonusScore: number;
  calculatedAt: string;
}

export interface ScoreSnapshotRepository {
  getByDayId(
    userId: string,
    dayId: string,
  ): Promise<ClosedDayScoreSnapshot | null>;
  listByDayIds(
    userId: string,
    dayIds: string[],
  ): Promise<ClosedDayScoreSnapshot[]>;
  upsert(
    userId: string,
    snapshot: ClosedDayScoreSnapshot,
  ): Promise<ClosedDayScoreSnapshot>;
}
