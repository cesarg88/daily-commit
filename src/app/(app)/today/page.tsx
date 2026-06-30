import { getTodayExecution } from "@/application/use-cases/today-execution";
import { requireAuthenticatedFounder } from "@/data/auth/server-session";
import { createDayRepositoryForUserSession } from "@/data/repositories/server-repositories";
import { getMvpTodayDate } from "@/domain/time/mvp-timezone";
import { TodayExecutionView } from "@/presentation/components/today-execution";
import { updateTodayProgressAction } from "./actions";

type TodayPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getStringParam(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TodayPage({ searchParams }: TodayPageProps) {
  const params = (await searchParams) ?? {};
  const founder = await requireAuthenticatedFounder();
  const model = await getTodayExecution(
    founder.id,
    getMvpTodayDate(),
    createDayRepositoryForUserSession(founder.accessToken),
  );

  return (
    <TodayExecutionView
      errorMessage={getStringParam(params.error)}
      model={model}
      updateProgressAction={updateTodayProgressAction}
    />
  );
}
