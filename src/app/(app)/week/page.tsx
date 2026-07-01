import { getWeeklyReview } from "@/application/use-cases/weekly-review";
import { requireAuthenticatedFounder } from "@/data/auth/server-session";
import {
  createDayRepositoryForUserSession,
  createScoreSnapshotRepositoryForUserSession,
} from "@/data/repositories/server-repositories";
import { getMvpTodayDate } from "@/domain/time/mvp-timezone";
import { WeeklyReviewView } from "@/presentation/components/weekly-review";

type WeekPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getStringParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function WeekPage({ searchParams }: WeekPageProps) {
  const params = (await searchParams) ?? {};
  const founder = await requireAuthenticatedFounder();
  const containingDate = getStringParam(params.date) ?? getMvpTodayDate();
  const model = await getWeeklyReview(
    founder.id,
    containingDate,
    createDayRepositoryForUserSession(founder.accessToken),
    createScoreSnapshotRepositoryForUserSession(founder.accessToken),
  );

  return <WeeklyReviewView model={model} />;
}
