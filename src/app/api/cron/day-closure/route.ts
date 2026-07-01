import { NextResponse } from "next/server";
import { isCronRequestAuthorized } from "@/application/auth/cron-auth";
import { closeActiveDaysBeforeDate } from "@/application/use-cases/day-closure-orchestration";
import {
  createDayRepositoryForServiceRole,
  createScoreSnapshotRepositoryForServiceRole,
} from "@/data/repositories/server-repositories";
import { getMvpTodayDate } from "@/domain/time/mvp-timezone";

export async function GET(request: Request) {
  if (!isCronRequestAuthorized(request.headers, process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentDateTime = new Date();
  const result = await closeActiveDaysBeforeDate(
    getMvpTodayDate(currentDateTime),
    createDayRepositoryForServiceRole(),
    createScoreSnapshotRepositoryForServiceRole(),
    currentDateTime,
  );

  return NextResponse.json({
    checkedDays: result.checkedDays,
    closedDays: result.closedDays,
  });
}
